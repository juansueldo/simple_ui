const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    context.scale(20, 20);

    const nextCanvas = document.getElementById('next');
    const nextContext = nextCanvas.getContext('2d');
    nextContext.scale(20, 20);

    function arenaSweep() {
      outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
          if (arena[y][x] === 0) continue outer;
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
      }
    }

    function collide(arena, player) {
      const [m, o] = [player.matrix, player.pos];
      for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
          if (m[y][x] !== 0 &&
              (arena[y + o.y] &&
               arena[y + o.y][x + o.x]) !== 0) {
            return true;
          }
        }
      }
      return false;
    }

    function createMatrix(w, h) {
      const matrix = [];
      while (h--) matrix.push(new Array(w).fill(0));
      return matrix;
    }

    function createPiece(type) {
      if (type === 'T') return [[0,1,0],[1,1,1],[0,0,0]];
      if (type === 'O') return [[2,2],[2,2]];
      if (type === 'L') return [[0,0,3],[3,3,3],[0,0,0]];
      if (type === 'J') return [[4,0,0],[4,4,4],[0,0,0]];
      if (type === 'I') return [[0,5,0,0],[0,5,0,0],[0,5,0,0],[0,5,0,0]];
      if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
      if (type === 'Z') return [[7,7,0],[0,7,7],[0,0,0]];
    }

    function drawMatrix(ctx, matrix, offset) {
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            ctx.fillStyle = colors[value];
            ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
          }
        });
      });
    }

    function draw() {
      context.fillStyle = '#000';
      context.fillRect(0, 0, canvas.width, canvas.height);
      drawMatrix(context, arena, {x:0, y:0});
      drawMatrix(context, player.matrix, player.pos);
    }

    function drawNext() {
      nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
      const offset = {
        x: Math.floor((4 - nextPiece[0].length) / 2),
        y: Math.floor((4 - nextPiece.length) / 2),
      };
      drawMatrix(nextContext, nextPiece, offset);
    }

    function merge(arena, player) {
      player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            arena[y + player.pos.y][x + player.pos.x] = value;
          }
        });
      });
    }

    function playerDrop() {
      player.pos.y++;
      if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
      }
      dropCounter = 0;
    }

    function playerMove(dir) {
      player.pos.x += dir;
      if (collide(arena, player)) {
        player.pos.x -= dir;
      }
    }

    function playerReset() {
      player.matrix = nextPiece;
      player.pos.y = 0;
      player.pos.x = Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);
      nextPiece = createPiece(randomPieceType());
      drawNext();
      if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        alert("🎮 Game Over");
      }
    }

    function rotate(matrix, dir) {
      for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
      }
      if (dir > 0) {
        matrix.forEach(row => row.reverse());
      } else {
        matrix.reverse();
      }
    }

    function playerRotate(dir) {
      const pos = player.pos.x;
      let offset = 1;
      rotate(player.matrix, dir);
      while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
          rotate(player.matrix, -dir);
          player.pos.x = pos;
          return;
        }
      }
    }

    function randomPieceType() {
      return 'TJLOSZI'[Math.floor(Math.random() * 7)];
    }

    const colors = [
      null,
      '#FF0D72', '#0DC2FF', '#0DFF72',
      '#F538FF', '#FF8E0D', '#FFE138', '#3877FF',
    ];

    const arena = createMatrix(12, 20);

    const player = {
      pos: {x: 0, y: 0},
      matrix: null,
    };

    let nextPiece = createPiece(randomPieceType());

    let dropCounter = 0;
    let dropInterval = 1000;
    let lastTime = 0;

    function update(time = 0) {
      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;
      if (dropCounter > dropInterval) {
        playerDrop();
      }
      draw();
      requestAnimationFrame(update);
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') playerMove(-1);
      else if (event.key === 'ArrowRight') playerMove(1);
      else if (event.key === 'ArrowDown') playerDrop();
      else if (event.key === 'q') playerRotate(-1);
      else if (event.key === 'w') playerRotate(1);
    });

    playerReset();
    update();