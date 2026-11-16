// Variabili
let data;
let maxWins = 0;
let teams = [];
let teamWins = {};
let myFont;
let futuraFont;

let margin = 60;

let gutter = 15;

let carWidth = 24;
let carHeight = 110;

let hoveredId = null;
let hovered = false;

// colore scuderia
let colorScale = {
  'Mercedes': '#39b29e',
  'Red Bull Racing Honda RBPT': '#222382',
  'Red Bull Racing RBPT': '#0077b6',
  'Red Bull Racing': '#0992ad',
  'Red Bull Racing Honda': '#90e0ef',
  'Ferrari': '#c0314d',
  'McLaren': '#e7892a',
  'McLaren Mercedes': '#f5be28',
  'Racing Point BWT Mercedes': '#f596c8',
  'Alpine Renault': '#00B7FF',
  'AlphaTauri Honda': '#b5ccdf'
};

async function setup() {
  createCanvas(windowWidth, windowHeight);

  data = await loadTable("assets/vittorief1.csv", ",", "header");

  //fonts
  myFont = await loadFont('assets/Formula1-Bold_web_0.ttf');
  futuraFont = await loadFont('assets/Futura Book.ttf');

  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let team = data.getString(rowNumber, "team");

    // vittorie per ogni team
    if (!teamWins[team]) {
      teamWins[team] = 0;
    }
    teamWins[team]++;

    // scuderie senza duplicati
    if (!teams.includes(team)) {
      teams.push(team);
    }
  }

  // valore max vittorie
  for (let t in teamWins) {
    if (teamWins[t] > maxWins) {
      maxWins = teamWins[t];
    }
  }
}

function draw() {
  background(245);

  // titolo
  push();
  fill('#FF1E00');
  textSize(45);
  textFont(myFont);
  text("F1 VICTORIES (2020-2025)", margin, 60);
  pop();

  // sottotitolo
  textFont(futuraFont);
  textSize(17);
  fill('#5b5959');
  text("Passa il mouse su ogni macchina per vedere il numero di vittorie di ogni scuderia, clicca per vedere il dettaglio", margin, 85);

  // legenda
  textFont(futuraFont);
  textSize(13);
  fill(0);
  textAlign(RIGHT, TOP);
  text("Colore = scuderia", width - margin* 0.4, 24);
  text("Altezza colonna = numero di vittorie", width - margin * 0.4, 44);
  textAlign(LEFT, BASELINE);

  let numberOfGutters = teams.length - 1;
  let colsWidth = width - 2 * margin - numberOfGutters * gutter;
  let colWidth = colsWidth / teams.length;

  let startY = height - margin - carHeight / 2 - 20;
  let maxTravel = startY - margin - 90;

  noStroke();

  fill(0);
  rect(margin, startY + carHeight / 2, width - 2 * margin, 2);

  let xPos = margin;

  hovered = false;
  hoveredId = null;

  for (let i = 0; i < teams.length; i++) {
    let team = teams[i];
    let currentWins = teamWins[team];
    let laneCenterX = xPos + colWidth / 2;

    let columnHeight = map(currentWins, 0, maxWins, 0, maxTravel);

    let teamColor = colorScale[team] || '#666666';

    let isHovered = (
      mouseX >= xPos &&
      mouseX <= xPos + colWidth &&
      mouseY >= margin - 20 &&
      mouseY <= height - margin
    );

    fill(teamColor);
    rect(laneCenterX - carWidth / 2, startY - columnHeight, carWidth, columnHeight + carHeight / 2);

    drawCar(laneCenterX, startY - columnHeight, teamColor);

    // numero vittorie con hover
    if (isHovered) {
      fill(0);
      textSize(12);
      textAlign(CENTER, BOTTOM);
      text(currentWins + " vittorie", laneCenterX, startY - columnHeight - carHeight / 2 - 4);

      hoveredId = team;
      hovered = true;
    }

    // nome scuderia
    fill(0);
    textSize(10);
    textAlign(CENTER, TOP);
    text(team, laneCenterX, startY + carHeight / 2 + 12);
    textAlign(LEFT, BASELINE);

    xPos += colWidth + gutter;
  }

  if (hovered) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function mousePressed() {
  if (hoveredId == null) {
    return;
  }

  // nuovo URL
  let newURL = "detail.html?team=" + hoveredId;

  console.log(newURL);

  // apertura pagina nella stessa scheda
  window.location.href = newURL;
}

// disegno macchina
function drawCar(x, y, carColor) {
  push();
  translate(x, y);

  noStroke();

  // ruote
  fill(30);
  // ruote anteriori
  rect(-22, -45, 10, 18, 3);
  rect(12, -45, 10, 18, 3);
  // ruote posteriori
  rect(-24, 25, 12, 22, 3);
  rect(12, 25, 12, 22, 3);

  // Sospensioni
  fill(50);
  rect(-18, -38, 36, 4);
  rect(-18, 33, 36, 4);

  // alettone anteriore
  fill(carColor);
  rect(-22, -55, 44, 8, 2);

  // alettone posteriore
  fill(carColor);
  rect(-22, 45, 44, 10, 2);

  // Riga nera
  fill(245);
  rect(-22, 53, 44, 4, 1);

  // corpo macchina
  fill(carColor);
  ellipse(0, 0, 38, 55);
  triangle(-18, -10, 18, -10, 0, -50);
  rect(-12, 10, 24, 38, 4);
  fill(255);
  rect(-5, 0, 10, 30, 4);
  fill(40);
  ellipse(0, -12, 12, 14);
  fill(255);
  ellipse(0, -12, 8, 8);

  pop();
}