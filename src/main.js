import './style.css'
import 'tw-elements'
import trashAsset from './assets/trash.png'
import cleanerAsset from './assets/cleaner.png'
import { Coordinates } from './entities/Coordinates'
import { Sector } from './entities/Sector'

document.querySelector('#app').innerHTML = `
<div>
  <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
    <form id="formSim">
      <div class="form-group mb-6">
        <input id="txtAttempt" type="number" class="form-control block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInput90"
          placeholder="Vacuum Cleaner Attempts"
          value="5">
      </div>
      <div class="form-group mb-6">
        <input id="txtQuantity" type="number" class="form-control block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInput91"
          placeholder="Trash Quantity"
          value="5">
      </div>
      <button id="btnRun" type="submit" class="
        w-full
        px-6
        py-2.5
        bg-blue-600
        text-white
        font-medium
        text-xs
        leading-tight
        uppercase
        rounded
        shadow-md
        hover:bg-blue-700 hover:shadow-lg
        focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
        active:bg-blue-800 active:shadow-lg
        transitioncleaner
        duration-150
        ease-in-out">Run simulation</button>
    </form>
  </div>
  <div class="simulation">
    <div class="main">
      <div id="sideA" class="location">
        <div class="trash-wrapper">
          <img id="trA1" class="img img-trash" src="${trashAsset}" />
        </div>
        <div class="trash-wrapper">
          <img id="trA2" class="img img-trash" src="${trashAsset}" />
        </div>
        <div class="trash-wrapper">
          <img id="trA3" class="img img-trash" src="${trashAsset}" />
        </div>
        <div class="trash-wrapper">
          <img id="trA4" class="img img-trash" src="${trashAsset}" />
        </div>
      </div>
      <div class="location-mid">
        <img id="vaccum" class="img img-vaccum" src="${cleanerAsset}" />
      </div>
      <div id="sideB" class="location">
        <div class="trash-wrapper">
          <img id="trB1" class="img img-trash" src="${trashAsset}" />
        </div>
        <div class="trash-wrapper">
          <img id="trB2" class="img img-trash" src="${trashAsset}" />
        </div>
        <div class="trash-wrapper">
          <img id="trB3" class="img img-trash" src="${trashAsset}" />
        </div>
        <div class="trash-wrapper">
          <img id="trB4" class="img img-trash" src="${trashAsset}" />
        </div>
      </div>
    </div>
  </div>
  <div>
    <h2 class="try-title">Intentos de aspirar: <span id="cleanTry">0</span></h2>
  </div>
</div>
`

const formSim = document.getElementById('formSim')

formSim.addEventListener('submit', event => {
  event.preventDefault()
  start()
})


const vaccum = [
  new Coordinates(
    document.getElementById('vaccum').offsetLeft,
    document.getElementById('vaccum').offsetTop),
  0
]

var attemptCounter = 0
var trash = 0
var state = false
var tiempo = undefined

const board = [{
  sector: [
    new Sector(
      new Coordinates(
        document.getElementById("trA1").offsetParent.offsetLeft + document.getElementById("trA1").offsetLeft - 25,
        document.getElementById("trA1").offsetParent.offsetTop + document.getElementById("trA1").offsetTop - 20
      ),
      false,
      document.getElementById("trA1")
    ),
    new Sector(
      new Coordinates(
        document.getElementById("trA2").offsetParent.offsetLeft + document.getElementById("trA2").offsetLeft - 25,
        document.getElementById("trA2").offsetParent.offsetTop + document.getElementById("trA2").offsetTop - 20
      ),
      false,
      document.getElementById("trA2")
    ),
    new Sector(
      new Coordinates(
        document.getElementById("trA3").offsetParent.offsetLeft + document.getElementById("trA3").offsetLeft - 25,
        document.getElementById("trA3").offsetParent.offsetTop + document.getElementById("trA3").offsetTop - 20
      ),
      false,
      document.getElementById("trA3")),
    new Sector(
      new Coordinates(
        document.getElementById("trA4").offsetParent.offsetLeft + document.getElementById("trA4").offsetLeft - 25,
        document.getElementById("trA4").offsetParent.offsetTop + document.getElementById("trA4").offsetTop - 20
      ),
      false,
      document.getElementById("trA4")
    )
  ],
  state: false
}, {
  sector: [
    new Sector(
      new Coordinates(
        document.getElementById("trB1").offsetParent.offsetLeft + document.getElementById("trB1").offsetLeft - 25,
        document.getElementById("trB1").offsetParent.offsetTop + document.getElementById("trB1").offsetTop - 20
      ),
      false,
      document.getElementById("trB1")
    ),
    new Sector(
      new Coordinates(
        document.getElementById("trB2").offsetParent.offsetLeft + document.getElementById("trB2").offsetLeft - 25,
        document.getElementById("trB2").offsetParent.offsetTop + document.getElementById("trB2").offsetTop - 20
      ),
      false,
      document.getElementById("trB2")
    ),
    new Sector(
      new Coordinates(
        document.getElementById("trB3").offsetParent.offsetLeft + document.getElementById("trB3").offsetLeft - 25,
        document.getElementById("trB3").offsetParent.offsetTop + document.getElementById("trB3").offsetTop - 20
      ),
      false,
      document.getElementById("trB3")
    ),
    new Sector(
      new Coordinates(
        document.getElementById("trB4").offsetParent.offsetLeft + document.getElementById("trB4").offsetLeft - 25,
        document.getElementById("trB4").offsetParent.offsetTop + document.getElementById("trB4").offsetTop - 20
      ),
      false,
      document.getElementById("trB4")
    )
  ],
  state: false
}]

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function moveToLeft(x) {
  var step = 1
  var xi = document.getElementById('vaccum').offsetLeft
  while (xi > x) {
    xi = xi - step
    document.getElementById('vaccum').style.left = xi + "px"
    await sleep(10)
  }
}

async function moveToRight(x) {
  var step = 1
  var xi = document.getElementById('vaccum').offsetLeft

  while (xi < x) {
    xi = xi + step
    document.getElementById('vaccum').style.left = xi + "px"
    await sleep(10)
  }

}

async function moveToDown(y) {

  var step = 1
  var yi = document.getElementById('vaccum').offsetTop
  while (yi < y) {
    yi = yi + step
    document.getElementById('vaccum').style.top = yi + "px"
    await sleep(10)
  }

}

async function moveToUp(y) {
  var step = 1
  var yi = document.getElementById('vaccum').offsetTop
  while (yi > y) {
    yi = yi - step
    document.getElementById('vaccum').style.top = yi + "px"
    await sleep(10)
  }

}

async function movervaccum(indice, sector) {

  const xi = document.getElementById('vaccum').offsetLeft
  const yi = document.getElementById('vaccum').offsetTop
  const x = board[indice].sector[sector].coordinates.x
  const y = board[indice].sector[sector].coordinates.y

  if (xi > x) {
    await moveToLeft(x)
  }
  if (xi < x) {
    await moveToRight(x)
  }
  if (yi < y) {
    await moveToDown(y)
  }
  if (yi > y) {
    await moveToUp(y)
  }

}

function updateStateSector(x) {
  state = false
  board[x].sector.forEach((n, i) => {
    if (n.state) {
      board[x].state = true
      state = true
    }
  })

  if (!state) {
    board[x].state = false
  }

}

async function cleaner(indice, sector) {
  await movervaccum(indice, sector)
  board[indice].sector[sector].state = false
  await updateStateSector(indice)
  await sleep(500)
  board[indice].sector[sector].img.style.visibility = "hidden"
  console.log("sector aspidaro...")
  trash = trash - 1
}

async function creartrash() {
  var indice = Math.floor(Math.random() * (2 - 0) + 0)
  var sector = Math.floor(Math.random() * (4 - 0) + 0)
  var tmp = board[indice].sector[sector]

  if (trash == 8) {
    console.log('error...')
    return
  }

  if (tmp.state == false) {
    tmp.img.style.visibility = true
    tmp.state = true
    tmp.img.style.visibility = "visible"
    updateStateSector(indice)
    return
  }

  creartrash()
}

async function fillInBoard(x) {
  var valori = 1
  while (valori <= x) {
    while (trash == 8) {
      console.log("waite 10s meanwhile the vaccum clean...")
      await sleep(10000)
    }

    await creartrash()

    trash = trash + 1
    valori = valori + 1
    tiempo = (Math.floor(Math.random() * (5 - 3) + 3)) * 1000
    console.log(tiempo)
    await sleep(tiempo)
  }
}

function changeSector() {
  if (vaccum[1] == 1) {
    vaccum[1] = 0
    return
  }
  vaccum[1] = 1
}

function start() {
  document.getElementById("btnRun").disabled = true
  let attempt = document.getElementById("txtAttempt").value
  let trashCounter = document.getElementById("txtQuantity").value
  fillInBoard(parseInt(trashCounter))
  findAllTrash(parseInt(attempt))
  document.getElementById("cleanTry").innerHTML = 0
  attemptCounter = 0

}

async function findAllTrash(attempt) {

  var sector = null


  for (var i = 0; i <= 3; i++) {
    if (board[vaccum[1]].sector[i].state) {
      sector = i
      break
    }
  }

  if (sector != null) {
    await cleaner(vaccum[1], sector)
    sector = null
  }

  if (!board[vaccum[1]].state) {
    await changeSector()
  }

  if (trash == 0) {
    await sleep(5000)
    sector = null
    attemptCounter += 1
    console.log(attemptCounter)
    document.getElementById("cleanTry").innerHTML = attemptCounter
  }

  if (attemptCounter >= attempt) {
    alert("Vaccum clean loop complete")
    document.getElementById("btnRun").disabled = false
    return
  }

  findAllTrash(attempt)

}