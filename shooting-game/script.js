const gunElement = document.getElementById("gunId");
const gunMagElement = document.getElementById("gunmagId");
const magElement = document.getElementById("magId");
const gameLoseElement = document.getElementById("gameLoseId");
const levelElement = document.getElementById("levelText");
const pointsElement = document.getElementById("pointsText");
const detailsElement = document.getElementById("detailsId");
const rocketsAmountElement = document.getElementById("rocketsIdAmount");
const rocketsBtnElement = document.getElementById("rocketsBtnId");

let bosses = {};
let bossesCount = 0;

let newTargetInterval;
let gameRunning = false;
let level = 1;
let points = 0;
let targetsHit = 0;
let magSize = 10;
const maxMagSize = 50;
let rocketsAmount = 0;
const targetsToLose = 50;
const targetsPerLevel = 35;
const targetsPerRocket = 100;

function getTargetIntevalTime() {
  switch (true) {
    case 1 < level && level <= 5:
      return 1000 - (level - 1) * 100;
    case 5 < level && level <= 10:
      return 500 - (level - 5) * 20;
    case 10 < level && level <= 20:
      return 400 - (level - 10) * 10;
    case 20 < level:
      return 300 - (level - 20) * 5;
    default:
      return 1000;
  }
}

function endGame() {
  gameLoseElement.childNodes[1].innerText = "You Lose!";
  gameLoseElement.childNodes[3].innerText = "Play Again";
  gameLoseElement.style.display = "flex";
  detailsElement.style.display = "block";
  clearInterval(newTargetInterval);
  gameRunning = false;
  document.removeEventListener("mousemove", moveGun);
  document.removeEventListener("click", shootBullet);
}

function removeAllTargets() {
  const targetsElemnts = Array.from(document.getElementsByClassName("target"));
  targetsElemnts.forEach((target) => {
    target.remove();
  });
}

function restartGame() {
  removeAllTargets();
  emptyMag();
  magElement.style.height = "120px";
  clearInterval(newTargetInterval);
  level = 1;
  points = 0;
  rocketsAmount = 0;
  rocketsAmountElement.innerText = "0";
  levelElement.innerText = `Level 1`;
  pointsElement.innerText = `0 Points`;
  startGame();
}

function handleRocketClick(event) {
  if (rocketsAmount === 0 || !gameRunning) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  rocketsAmount--;
  rocketsAmountElement.innerText = rocketsAmount;
  if (rocketsAmount === 0) {
    rocketsBtnElement.style["box-shadow"] = "0 0 10px 3px gray";
  }
  const newRocketElement = document.createElement("div");
  newRocketElement.classList.add("rocket");
  newRocketElement.style.top = "unset";
  newRocketElement.style.bottom = "0px";
  newRocketElement.style.right = "40px";
  document.body.append(newRocketElement);
  setTimeout(() => {
    newRocketElement.style.bottom = "50%";
    newRocketElement.style.right = "70%";
  }, 0);
  setTimeout(() => {
    newRocketElement.style["box-shadow"] = "0 0px 50px 50px red";
    removeAllTargets();
  }, 1000);
  setTimeout(() => {
    newRocketElement.remove();
  }, 1500);
}

function emptyMag() {
  const bulletsInMag = Array.from(document.getElementsByClassName("magBullet"));
  bulletsInMag.forEach((bullet) => {
    bullet.remove();
  });
}

function setLevel(newLevel) {
  level = newLevel;
  emptyMag();
  reloadMag();
  if (magSize < maxMagSize) {
    magSize++;
  }
  magElement.style.height = `${magSize * 10 + 20}px`;
  clearInterval(newTargetInterval);
  addTargetIntervals();
  levelElement.innerText = `Level ${newLevel}`;
}

function startGame() {
  gameLoseElement.style.display = "none";
  detailsElement.style.display = "none";
  gameRunning = true;
  document.addEventListener("mousemove", moveGun);
  document.addEventListener("click", shootBullet);
  reloadMag();
  addTargetIntervals();
}

function addTargetIntervals() {
  newTargetInterval = setInterval(() => {
    const targetsElemnts = Array.from(
      document.getElementsByClassName("target")
    );
    if (targetsElemnts.length >= targetsToLose) {
      endGame();
    }
    const randIsBossType = Math.floor(Math.random() * 100);
    const randomX = Math.floor(
      (Math.random() * document.body.clientWidth) / 2.5
    );
    let randomY = Math.floor(Math.random() * document.body.clientHeight - 50);
    if (randomY < 10) {
      randomY = 10;
    }
    const newElement = document.createElement("div");
    newElement.style.top = `${randomY}px`;
    newElement.style.left = `${randomX}px`;
    if (randIsBossType === 50) {
      newElement.classList.add("target");
      newElement.classList.add("targetBoss");
      bossesCount++;
      newElement.id = `boss${bossesCount}`;
      bosses = {
        ...bosses,
        [`boss${bossesCount}`]: { element: newElement, health: 5 }
      };
    } else {
      newElement.classList.add("target");
    }
    document.body.append(newElement);
    clearInterval(newTargetInterval);
    if (gameRunning) {
      addTargetIntervals();
    }
  }, getTargetIntevalTime());
}

function reloadMag(withLoading = false) {
  if (withLoading) {
    gunMagElement.style.top = "100px";
    const loaderElement = document.createElement("div");
    loaderElement.classList.add("loadingMag");
    loaderElement.innerText = "Loading mag...";
    document.body.append(loaderElement);
    setTimeout(() => {
      gunMagElement.style.top = "10px";
    }, 1000);
    setTimeout(() => {
      for (let i = 0; i < magSize; i++) {
        console.log(111);
        const newBullet = document.createElement("div");
        newBullet.classList.add("magBullet");
        magElement.append(newBullet);
      }
      loaderElement.remove();
    }, 2000);
  } else {
    for (let i = 0; i < magSize; i++) {
      console.log(222);
      const newBullet = document.createElement("div");
      newBullet.classList.add("magBullet");
      magElement.append(newBullet);
    }
  }
}

function isInShootingArea(e) {
  const clientWidth = document.body.clientWidth;
  const { clientX } = e;
  if (clientWidth / 3 < clientWidth - clientX) {
    return false;
  }
  return true;
}

function moveGun(e) {
  const { clientY, clientX } = e;
  if (!isInShootingArea(e)) {
    return;
  }
  gunElement.style.top = `${clientY - 20}px`;
  gunElement.style.left = `${clientX - 60}px`;
}

function onTargetKill() {
  targetsHit++;
  if (targetsHit % targetsPerLevel === 0) {
    setLevel(level + 1);
  }
  if (targetsHit % targetsPerRocket === 0) {
    rocketsAmount++;
    rocketsAmountElement.innerText = rocketsAmount;
    rocketsBtnElement.style["box-shadow"] = "0 0 10px 3px green";
  }
}

function checkForTargetInArea(bullet) {
  let anyHit = false;
  const bulletInterval = setInterval(() => {
    const bulletTop = bullet.offsetTop;
    const bulletLeft = bullet.offsetLeft;
    const targetsElemnts = Array.from(
      document.getElementsByClassName("target")
    );
    targetsElemnts.forEach((target) => {
      const targetTop = target.offsetTop;
      const targetLeft = target.offsetLeft;
      if (
        targetTop + 50 >= bulletTop &&
        bulletTop >= targetTop &&
        targetLeft <= bulletLeft &&
        bulletLeft <= targetLeft + 50 &&
        target.id !== "dead"
      ) {
        clearInterval(bulletInterval);
        if (target.id && target.id.includes("boss")) {
          const bossId = target.id;
          if (bosses[bossId]) {
            if (bosses[bossId].health === 1) {
              target.id = "dead";
              bullet.remove();
              emptyMag();
              reloadMag();
              onTargetKill();
              target.style["box-shadow"] =
                "0 0 20px 15px red, inset 0 0 13px 3px red";
              setTimeout(() => {
                target.remove();
              }, 1000);
              points = points + 50;
              pointsElement.innerText = `${points + 50} Points`;
              delete bosses[bossId];
            } else {
              bullet.remove();
              bosses[bossId].health = bosses[bossId].health - 1;
              target.style["box-shadow"] = "inset 0 0 13px 3px red";
              setTimeout(() => {
                target.style["box-shadow"] = "none";
              }, 1000);
            }
          }
        } else {
          target.id = "dead";
          bullet.remove();
          target.style["box-shadow"] =
            "0 0 20px 15px red, inset 0 0 13px 3px red";
          onTargetKill();
          setTimeout(() => {
            target.remove();
          }, 1000);
        }
        anyHit = true;
        points = points + 10;
        pointsElement.innerText = `${points + 10} Points`;
      }
    });
  }, 10);
  setTimeout(() => {
    clearInterval(bulletInterval);
    if (!anyHit) {
      points = points - 5;
      pointsElement.innerText = `${points - 5} Points`;
    }
  }, 1000);
}

function shootBullet(e) {
  if (!isInShootingArea(e)) {
    return;
  }
  const bulletsInMag = Array.from(document.getElementsByClassName("magBullet"));
  if (bulletsInMag.length === 0) {
    return;
  }
  bulletsInMag[bulletsInMag.length - 1].remove();
  if (bulletsInMag.length === 1) {
    reloadMag(true);
  }
  const gunTop = gunElement.offsetTop;
  const gunLeft = gunElement.offsetLeft;
  const newElement = document.createElement("div");
  newElement.style.top = `${gunTop + 2}px`;
  newElement.style.left = `${gunLeft}px`;
  gunElement.style["box-shadow"] = "-6px 2px 5px -1px red";
  newElement.classList.add("bullet");
  document.body.append(newElement);
  checkForTargetInArea(newElement);
  setTimeout(() => {
    newElement.style.left = `${-10}px`;
  }, 0);
  setTimeout(() => {
    gunElement.style["box-shadow"] = "none";
  }, 100);
  setTimeout(() => {
    newElement.remove();
  }, 1000);
}