// Variabili
let data;
let myFont;
let futuraFont;

let margin = 60;

let carWidth = 24;
let carHeight = 110;

let selectedTeam;

let selectedWins = 0;

let driverWins = {};
let numberOfDrivers = 0;
let drivers = [];

let teams = [];

let years = [];

let yearWins = {};

let teamWins = {};
let maxWins = 0;
let teamYearWins = {};
let maxYearWins = 0;

let backHovered = false;

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

  data = await loadTable("assets/vittorief1.csv", ",", "header");

  //fonts
  myFont = await loadFont('assets/Formula1-Bold_web_0.ttf');
  futuraFont = await loadFont('assets/Futura Book.ttf');

  let params = getURLParams();

  selectedTeam = decodeURIComponent(params.team || 'Mercedes');

  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let team = data.getString(rowNumber, "team");
    let year = data.getString(rowNumber, "year");

    // anni senza duplicati
    if (!years.includes(year)) {
      years.push(year);
      yearWins[year] = 0;
    }

    // vittorie scuderia
    if (!teamWins[team]) {
      teamWins[team] = 0;
    }
    teamWins[team]++;

    if (!teams.includes(team)) {
      teams.push(team);
    }

    // vittorie scuderia nei singoli anni
    let key = team + year;
    if (!teamYearWins[key]) {
      teamYearWins[key] = 0;
    }
    teamYearWins[key]++;

    if (team == selectedTeam) {
      selectedWins++;
      yearWins[year]++;

      let driver = data.getString(rowNumber, "winner_name");
      if (!driverWins[driver]) {
        driverWins[driver] = 0;
        numberOfDrivers++;
        drivers.push(driver);
      }
      driverWins[driver]++;
    }
  }

  // valori massimi
  for (let i = 0; i < teams.length; i++) {
    if (teamWins[teams[i]] > maxWins) {
      maxWins = teamWins[teams[i]];
    }
    for (let j = 0; j < years.length; j++) {
      if (teamYearWins[teams[i] + years[j]] > maxYearWins) {
        maxYearWins = teamYearWins[teams[i] + years[j]];
      }
    }
  }

  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(245);

  let teamColor = colorScale[selectedTeam] || '#666666';

  // linea di base
  let baseY = height - margin - 30;

  //link per tornare alla pagina principale
  textFont(futuraFont);
  textSize(15);
  fill('#5b5959');
  text("← Torna alla pagina principale", margin, 35);

  backHovered = (
    mouseX >= margin &&
    mouseX <= margin + textWidth("← Torna alla pagina principale") &&
    mouseY >= 20 &&
    mouseY <= 40
  );

  //titolo e sottotitolo 
  push();
  fill('#FF1E00');
  textSize(45);
  textFont(myFont);
  text(selectedTeam, margin, 90);
  pop();

  // legenda
  textSize(13);
  fill(0);
  textAlign(RIGHT, TOP);
  text("Disegno macchina con colonna = vittorie totali", width - margin* 0.4, 24);
  text("Colonne per anno = vittorie in ogni anno", width - margin * 0.4, 44);
  textAlign(LEFT, BASELINE);

  noStroke();

  // disegno macchina 
  let carX = margin + 50;
  let maxTravel = baseY - carHeight / 2 - 230;
  let columnHeight = map(selectedWins, 0, maxWins, 0, maxTravel);
  let carY = baseY - carHeight / 2 - columnHeight;

  fill(teamColor);
  rect(carX - carWidth / 2, carY, carWidth, columnHeight + carHeight / 2);
  drawCar(carX, carY, teamColor);

  fill(0);
  rect(margin, baseY, 100, 2);

  // vittorie e piloti
  let infoX = margin + 130;
  let infoY = 140;

  fill('#5b5959');
  textSize(13);
  text("VITTORIE", infoX, infoY);
  text("PILOTI", infoX + 120, infoY);

  fill(0);
  textSize(40);
  text(selectedWins, infoX, infoY + 42);
  text(numberOfDrivers, infoX + 120, infoY + 42);

  //piloti 
  fill('#5b5959');
  textSize(13);
  text("Piloti vincitori", infoX, infoY + 90);

  let namesX = infoX;
  let winsX = infoX + 200;

  let driverY = infoY + 120;
  for (let i = 0; i < drivers.length; i++) {
    let d = drivers[i];
    fill(0);
    textSize(17);
    text(d, namesX, driverY);

    fill('#5b5959');
    textSize(14);
    text(winsText(driverWins[d]), winsX, driverY);

    driverY += 20;
  }

  // colonne per anno
  let yearsStartX = width * 0.45;
  let yearSpace = (width - margin - yearsStartX) / years.length;
  let maxYearHeight = baseY - 230;
  let barWidth = yearSpace * 0.7;

  for (let i = 0; i < years.length; i++) {
    let year = years[i];
    let wins = yearWins[year];
    let centerX = yearsStartX + i * yearSpace + yearSpace / 2;

    let barHeight = map(wins, 0, maxYearWins, 0, maxYearHeight);

    fill(teamColor);
    rect(centerX - barWidth / 2, baseY - barHeight, barWidth, barHeight);

    push();
    textAlign(CENTER, CENTER);

    // numero di vittorie su colonne
    fill(0);
    textSize(16);
    text(wins, centerX, baseY - barHeight - 14);

    // anno sotto colonna
    fill('#5b5959');
    textSize(15);
    text(year, centerX, baseY + 18);
    pop();
  }

  fill(0);
  rect(yearsStartX, baseY, width - margin - yearsStartX, 2);

}

// al click sul link torno alla pagina d'insieme
function mousePressed() {
  if (backHovered) {
    window.location.href = "index.html";
  }
}

// "1 vittoria" al singolare e "2 vittorie" al plurale
function winsText(n) {
  if (n == 1) {
    return n + " vittoria";
  }
  return n + " vittorie";
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
