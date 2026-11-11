const $ = s => document.querySelector(s);
const homeView=$('#home-view'), gameView=$('#game-view'), stage=$('#game-stage');
let currentGame='', score=0, cleanup=()=>{}, soundOn=false, audioCtx=null;
const games={
 snake:{title:'Snake',category:'CLASSIC ARCADE',desc:'The longer you survive, the higher your score.',instructions:'Guide the snake to the food. Each bite makes you longer. Avoid the walls and your own tail.',controls:['<span class="key">↑</span><span class="key">↓</span><span class="key">←</span><span class="key">→</span> Move','<span class="key">SPACE</span> Pause'],start:startSnake},
 mines:{title:'Minesweeper',category:'LOGIC PUZZLE',desc:'A clear mind is your best tool.',instructions:'Reveal every safe square without hitting a mine. Numbers show how many mines touch that square. Right-click to flag a suspected mine.',controls:['<span class="key">CLICK</span> Reveal','<span class="key">RIGHT CLICK</span> Flag'],start:startMines},
 '2048':{title:'2048',category:'NUMBER PUZZLE',desc:'Combine matching numbers and reach the 2048 tile.',instructions:'Use the arrow keys or swipe to slide all tiles. Matching numbers merge into one. The game ends when no moves remain.',controls:['<span class="key">ARROWS</span> Move tiles','<span class="key">R</span> Restart'],start:start2048},
 tetris:{title:'Tetris',category:'CLASSIC ARCADE',desc:'Fit the falling pieces. Keep the stack under control.',instructions:'Move and rotate falling tetrominoes to complete horizontal lines. Completed lines disappear and award points.',controls:['<span class="key">←</span><span class="key">→</span> Move','<span class="key">↑</span> Rotate','<span class="key">↓</span> Soft drop','<span class="key">SPACE</span> Hard drop'],start:startTetris},
 reaction:{title:'Reaction test',category:'REFLEX TEST',desc:'Wait for green. Then click as fast as you can.',instructions:'Click start and wait for the panel to turn green. Click as quickly as possible. Clicking too early resets the attempt. Your best reaction time is saved.',controls:['<span class="key">CLICK</span> Start / react'],start:startReaction},
 memory:{title:'Memory',category:'MEMORY PUZZLE',desc:'Find all eight matching pairs.',instructions:'Flip two cards at a time and find matching symbols. Try to finish in as few moves as possible.',controls:['<span class="key">CLICK</span> Flip card'],start:startMemory}
};
function setScore(n){score=n;$('#live-score').textContent=n.toLocaleString()}
function bestKey(){return 'arcade-best-'+currentGame}
function updateBest(n){let b=Number(localStorage.getItem(bestKey())||0);if(n>b){localStorage.setItem(bestKey(),n);b=n}$('#best-score').textContent=b.toLocaleString()}
function openGame(id){currentGame=id;homeView.classList.add('hidden');gameView.classList.remove('hidden');let g=games[id];$('#game-title').textContent=g.title;$('#game-category').textContent=g.category;$('#game-description').textContent=g.desc;$('#game-instructions').textContent=g.instructions;$('#game-controls').innerHTML=g.controls.map(x=>'<div>'+x+'</div>').join('');$('#best-score').textContent=Number(localStorage.getItem(bestKey())||0).toLocaleString();setScore(0);startCurrent();window.scrollTo(0,0)}
function closeGame(){cleanup();gameView.classList.add('hidden');homeView.classList.remove('hidden');window.scrollTo(0,0)}
function startCurrent(){cleanup();stage.innerHTML='';setScore(0);cleanup=games[currentGame].start()||(()=>{});$('#best-score').textContent=Number(localStorage.getItem(bestKey())||0).toLocaleString()}
function message(title,sub,button='PLAY AGAIN',action=startCurrent){let m=document.createElement('div');m.className='game-message';m.innerHTML=`<strong>${title}</strong><span>${sub}</span><button>${button}</button>`;m.querySelector('button').onclick=action;stage.append(m)}
function beep(freq=440,dur=.07){if(!soundOn)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=freq;g.gain.value=.035;o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur)}catch(e){}}
$('#sound-toggle').onclick=()=>{soundOn=!soundOn;$('#sound-toggle').style.color=soundOn?'var(--lime)':'var(--text)';beep()};
document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>openGame(b.dataset.game));
$('#back-home').onclick=closeGame;document.querySelector('[data-home]').onclick=e=>{e.preventDefault();closeGame()};$('#restart-game').onclick=startCurrent;
window.addEventListener('keydown',e=>{if(currentGame&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault()});

// Snake
function startSnake(){
 const c=document.createElement('canvas');c.width=420;c.height=420;stage.append(c);let x=c.getContext('2d'),cell=21,cols=20,rows=20,snake=[{x:9,y:10},{x:8,y:10},{x:7,y:10}],dir={x:1,y:0},next={...dir},food={x:14,y:10},over=false,paused=false,timer;
 function place(){do{food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)}}while(snake.some(p=>p.x===food.x&&p.y===food.y))}
 function draw(){x.fillStyle='#121a28';x.fillRect(0,0,420,420);x.strokeStyle='#1d293b';for(let i=0;i<=20;i++){x.beginPath();x.moveTo(i*cell,0);x.lineTo(i*cell,420);x.stroke();x.beginPath();x.moveTo(0,i*cell);x.lineTo(420,i*cell);x.stroke()}x.fillStyle='#ffb36b';x.beginPath();x.arc(food.x*cell+10.5,food.y*cell+10.5,7,0,Math.PI*2);x.fill();snake.forEach((p,i)=>{x.fillStyle=i?'#83bd57':'#c4f36b';x.beginPath();x.roundRect(p.x*cell+1,p.y*cell+1,19,19,5);x.fill()})}
 function tick(){if(over||paused)return;dir=next;let h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.y<0||h.x>=cols||h.y>=rows||snake.some((p,i)=>i<snake.length-1&&p.x===h.x&&p.y===h.y)){over=true;clearInterval(timer);message('Game over',`You scored ${score} points.`);return}snake.unshift(h);if(h.x===food.x&&h.y===food.y){setScore(score+10);beep(650);place()}else snake.pop();draw()}
 function key(e){let m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};if(m[e.key]){let [dx,dy]=m[e.key];if(dx!==-dir.x||dy!==-dir.y)next={x:dx,y:dy}}if(e.code==='Space'){paused=!paused;if(!paused)tick()}}
 window.addEventListener('keydown',key);draw();timer=setInterval(tick,115);
 return()=>{clearInterval(timer);window.removeEventListener('keydown',key)}
}

// Minesweeper
function startMines(){
 const size=9,mines=10;let cells=Array(size*size).fill(0).map(()=>({mine:false,open:false,flag:false,n:0})),first=true,ended=false,flags=0;
 const board=document.createElement('div');board.className='mine-board';stage.append(board);
 function neighbors(i){let a=[];for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++){if(!x&&!y)continue;let nx=i%size+x,ny=Math.floor(i/size)+y;if(nx>=0&&nx<size&&ny>=0&&ny<size)a.push(ny*size+nx)}return a}
 function setup(safe){let choices=cells.map((_,i)=>i).filter(i=>i!==safe);for(let k=0;k<mines;k++){let j=Math.floor(Math.random()*choices.length),i=choices.splice(j,1)[0];cells[i].mine=true}cells.forEach((c,i)=>c.n=neighbors(i).filter(j=>cells[j].mine).length)}
 function render(){board.innerHTML='';cells.forEach((c,i)=>{let b=document.createElement('button');b.className='mine-cell'+(c.open?' revealed':'')+(c.flag?' flagged':'');b.textContent=c.flag?'⚑':c.open?(c.mine?'✹':c.n||''):'';if(c.open&&c.n)b.style.color=['','#7dc8ff','#7ed49b','#ff8e7d','#b6a0ff','#ffb36b'][c.n]||'#fff';b.onclick=()=>reveal(i);b.oncontextmenu=e=>{e.preventDefault();flag(i)};board.append(b)})}
 function finish(win){ended=true;if(win){setScore(100+Math.max(0,50-flags)*2);updateBest(score);message('Field cleared!',`You found all safe squares. Score: ${score}.`)}else message('Boom!',`You uncovered a mine. Flags used: ${flags}.`)}
 function reveal(i){if(ended||cells[i].open||cells[i].flag)return;if(first){setup(i);first=false}let c=cells[i];c.open=true;if(c.mine){render();finish(false);return}if(!c.n)neighbors(i).forEach(j=>{if(!cells[j].open)revealSafe(j)});let opened=cells.filter(c=>c.open).length;render();setScore(opened);if(opened===size*size-mines)finish(true)}
 function revealSafe(i){if(cells[i].open||cells[i].flag||cells[i].mine)return;cells[i].open=true;if(!cells[i].n)neighbors(i).forEach(revealSafe)}
 function flag(i){if(ended||cells[i].open)return;cells[i].flag=!cells[i].flag;flags+=cells[i].flag?1:-1;render()}
 render();return()=>{};
}

// 2048
function start2048(){
 let grid=Array(16).fill(0),ended=false,won=false;function spawn(){let a=grid.map((v,i)=>v?null:i).filter(v=>v!==null);if(a.length){let i=a[Math.floor(Math.random()*a.length)];grid[i]=Math.random()<.9?2:4}}
 spawn();spawn();const wrap=document.createElement('div');wrap.className='board-2048';stage.append(wrap);
 function draw(){wrap.innerHTML='';grid.forEach(v=>{let d=document.createElement('div');d.className='tile';if(v)d.dataset.v=v;d.textContent=v||'';wrap.append(d)});setScore(grid.reduce((a,b)=>a+b,0))}
 function move(dir){if(ended)return;let old=grid.join(','),out=Array(16).fill(0);for(let line=0;line<4;line++){let ids=[];for(let j=0;j<4;j++){let r=dir==='up'?j:dir==='down'?3-j:line,c=dir==='left'?j:dir==='right'?3-j:line;ids.push(r*4+c)}let vals=ids.map(i=>grid[i]).filter(Boolean),merged=[];for(let j=0;j<vals.length;j++){if(vals[j]===vals[j+1]){merged.push(vals[j]*2);j++;}else merged.push(vals[j])}ids.forEach((id,j)=>out[id]=merged[j]||0)}grid=out;if(grid.join(',')===old)return;spawn();draw();if(grid.includes(2048)&&!won){won=true;message('2048 reached!','Amazing! Keep playing or start a new game.','KEEP PLAYING',()=>{stage.querySelector('.game-message')?.remove()})}if(!grid.some(v=>!v)&&!hasMoves()){ended=true;message('No more moves','Final score: '+score)}}
 function hasMoves(){for(let i=0;i<16;i++){if(i%4<3&&grid[i]===grid[i+1])return true;if(i<12&&grid[i]===grid[i+4])return true}return false}
 function key(e){let d={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[e.key];if(d)move(d);if(e.key.toLowerCase()==='r')startCurrent()}
 window.addEventListener('keydown',key);let sx=0,sy=0;wrap.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});wrap.addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))>25)move(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'))});
 draw();return()=>window.removeEventListener('keydown',key)
}

// Tetris
function startTetris(){
 const W=10,H=20,cell=20,shapes=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[1,1,0],[0,1,1]],[[0,1,1],[1,1,0]]],colors=['#6de0d2','#ffb36b','#b6a0ff','#78a7ff','#f17f9c','#c4f36b','#e98a5b'];
 let grid=Array.from({length:H},()=>Array(W).fill(0)),piece,px,py,over=false,drop=0,last=0,raf;
 const c=document.createElement('canvas');c.width=W*cell;c.height=H*cell;stage.append(c);let ctx=c.getContext('2d');
 function newPiece(){let n=Math.floor(Math.random()*shapes.length);piece=shapes[n].map(r=>r.slice());piece.color=colors[n];px=3;py=0;if(hit(px,py,piece)){over=true;message('Game over','Final score: '+score)}}
 function hit(x,y,p){for(let r=0;r<p.length;r++)for(let col=0;col<p[r].length;col++)if(p[r][col]&&(x+col<0||x+col>=W||y+r>=H||(y+r>=0&&grid[y+r][x+col])))return true;return false}
 function lock(){piece.forEach((r,y)=>r.forEach((v,x)=>{if(v&&py+y>=0)grid[py+y][px+x]=piece.color}));let lines=0;grid=grid.filter(r=>{if(r.every(Boolean)){lines++;return false}return true});while(grid.length<H)grid.unshift(Array(W).fill(0));if(lines){setScore(score+[0,100,300,500,800][lines]);beep(500+lines*100)}newPiece()}
 function draw(){ctx.fillStyle='#121a28';ctx.fillRect(0,0,c.width,c.height);for(let y=0;y<H;y++)for(let x=0;x<W;x++){let v=grid[y][x];if(v){ctx.fillStyle=v;ctx.fillRect(x*cell+1,y*cell+1,cell-2,cell-2)}ctx.strokeStyle='#243247';ctx.strokeRect(x*cell,y*cell,cell,cell)}if(piece)piece.forEach((r,y)=>r.forEach((v,x)=>{if(v){ctx.fillStyle=piece.color;ctx.fillRect((px+x)*cell+1,(py+y)*cell+1,cell-2,cell-2)}}))}
 function rotate(p){return p[0].map((_,i)=>p.map(r=>r[i]).reverse())}
 function key(e){if(over)return;if(e.key==='ArrowLeft'&&!hit(px-1,py,piece))px--;if(e.key==='ArrowRight'&&!hit(px+1,py,piece))px++;if(e.key==='ArrowDown'){if(!hit(px,py+1,piece))py++;else lock()}if(e.key==='ArrowUp'){let r=rotate(piece);if(!hit(px,py,r)){piece=r;piece.color=colors[shapes.findIndex(s=>s.length===r.length)]||piece.color}}if(e.code==='Space'){while(!hit(px,py+1,piece))py++;lock()}draw()}
 function loop(t){if(over)return;if(t-last>480){last=t;if(!hit(px,py+1,piece))py++;else lock()}draw();raf=requestAnimationFrame(loop)}
 window.addEventListener('keydown',key);newPiece();raf=requestAnimationFrame(loop);
 return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',key)}
}

// Reaction test
function startReaction(){
 let state='idle',start=0,timer=null,best=Number(localStorage.getItem('arcade-reaction-best')||0);const box=document.createElement('button');box.className='reaction-box';box.innerHTML='<strong>Ready?</strong><span>Click to begin</span>';stage.append(box);
 function reset(){state='waiting';box.className='reaction-box waiting';box.innerHTML='<strong>Wait for green...</strong><span>Don't click yet</span>';timer=setTimeout(()=>{state='ready';start=performance.now();box.className='reaction-box ready';box.innerHTML='<strong>CLICK NOW!</strong><span>As fast as you can</span>'},1000+Math.random()*3500)}
 box.onclick=()=>{if(state==='idle'){reset();return}if(state==='waiting'){clearTimeout(timer);state='idle';box.className='reaction-box';box.innerHTML='<strong>Too soon!</strong><span>Click to try again</span>';return}if(state==='ready'){let ms=Math.round(performance.now()-start);state='idle';setScore(ms);let b=Number(localStorage.getItem('arcade-reaction-best')||99999);if(ms<b){localStorage.setItem('arcade-reaction-best',ms);$('#best-score').textContent=ms+' ms'}box.className='reaction-box';box.innerHTML=`<strong>${ms} ms</strong><span>${ms<200?'Lightning fast!':ms<280?'Nice reflexes!':'Try to beat that.'} · click to retry</span>`;beep(700)}};
 $('#best-score').textContent=best?best+' ms':'—';return()=>clearTimeout(timer)
}

// Memory
function startMemory(){
 const symbols=['◆','●','▲','★','♥','✦','☯','⬟'];let deck=[...symbols,...symbols].sort(()=>Math.random()-.5),first=null,lock=false,moves=0,matches=0;const board=document.createElement('div');board.className='memory-board';stage.append(board);
 function render(){board.innerHTML='';deck.forEach((v,i)=>{let b=document.createElement('button');b.className='memory-card'+(v.open?' flipped':'')+(v.matched?' matched':'');b.textContent=v.open||v.matched?v:'?';b.onclick=()=>flip(i);board.append(b)})}
 function flip(i){let card=deck[i];if(lock||card.open||card.matched)return;card.open=true;beep(450);if(first===null){first=i;render();return}moves++;setScore(moves);if(deck[first].symbol===card.symbol){deck[first].matched=deck[first].open=true;card.matched=true;matches++;first=null;render();if(matches===8){let points=Math.max(10,200-moves*5);setScore(points);updateBest(points);message('All pairs found!',`Completed in ${moves} moves. Score: ${points}.`)}}else{lock=true;let prev=first;first=null;render();setTimeout(()=>{deck[prev].open=false;card.open=false;lock=false;render()},750)}}
 deck=deck.map(symbol=>({symbol,open:false,matched:false}));render();return()=>{}
}
