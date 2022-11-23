let blackjackgame = {
  you: { scoreSpan: '#your-result', div: '#your-box', score: 0 },
  dealer: { scoreSpan: '#dealer-result', div: '#dealer-box', score: 0 },
  cards: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'K', 'Q', 'J'],
  cardMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    Q: 10,
    J: 10,
    A: [1, 11],
  },
}

const YOU = blackjackgame['you']
const DEALER = blackjackgame['dealer']

var win = 0
var loss = 0
var draw = 0
var hitCounter = 0

const hitSound = new Audio('assets/sounds/swish.m4a')
const bustSound = new Audio('assets/sounds/aww.mp3')
const winSound = new Audio('assets/sounds/cash.mp3')

document.querySelector('#hit-btn').addEventListener('click', blackjackhit)
document.querySelector('#deal-btn').addEventListener('click', blackjackdeal)
document.querySelector('#stand-btn').addEventListener('click', dealerLogic)
document.querySelector('#reset-btn').addEventListener('click', reset)

function reset() {
  document.location.reload()
}

function blackjackhit() {
  document.querySelector('#deal-btn').disabled = true

  let card = randomCard()
  showCard(YOU, card)
  updateScore(card, YOU)
  showScore(YOU)
  if (YOU['score'] > 21) {
    document.querySelector('#hit-btn').disabled = true
    document.querySelector('#result').textContent = 'You Loss !'
    document.querySelector('#result').style.color = 'red'
    loss++
    document.querySelector('#Losses').textContent = loss
    document.querySelector('#stand-btn').disabled = true
  }
  hitCounter++
}

function showCard(activePlayer, card) {
  if (activePlayer['score'] < 21) {
    let cardImg = document.createElement('img')
    cardImg.src = `assets/images/${card}.png`
    document.querySelector(activePlayer['div']).appendChild(cardImg)
    hitSound.play()
  }
}

function blackjackdeal() {
  let yourCards = document.querySelector('#your-box').querySelectorAll('img')
  let dealerCards = document
    .querySelector('#dealer-box')
    .querySelectorAll('img')

  yourCards.forEach((image) => {
    image.remove()
  })

  dealerCards.forEach((image) => {
    image.remove()
  })

  document.querySelector(YOU['scoreSpan']).style.color = 'white'
  document.querySelector(YOU['scoreSpan']).textContent = 0
  YOU['score'] = 0

  document.querySelector(DEALER['scoreSpan']).style.color = 'white'
  document.querySelector(DEALER['scoreSpan']).textContent = 0
  DEALER['score'] = 0

  document.querySelector('#hit-btn').disabled = false
  document.querySelector('#stand-btn').disabled = false

  document.querySelector('#result').textContent = `Let's Play`
  document.querySelector('#result').style.color = `black`
  hitCounter = 0
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13)
  return blackjackgame['cards'][randomIndex]
}

function updateScore(card, activePlayer) {
  if (card === 'A') {
    if (activePlayer['score'] + blackjackgame['cardMap'][card][1] <= 21) {
      activePlayer['score'] += blackjackgame['cardMap'][card][1]
    } else activePlayer['score'] += blackjackgame['cardMap'][card][0]
  } else activePlayer['score'] += blackjackgame['cardMap'][card]
}

function showScore(activePlayer) {
  if (activePlayer['score'] > 21) {
    document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!'
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red'
    if (activePlayer === YOU) {
      bustSound.play()
    } else winSound.play()
  } else {
    document.querySelector(activePlayer['scoreSpan']).textContent =
      activePlayer['score']
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function dealerLogic() {
  document.querySelector('#hit-btn').disabled = true
  while (hitCounter-- > 0) {
    if (DEALER['score'] > YOU['score']) {
      break
    } else {
      let card = randomCard()
      showCard(DEALER, card)
      updateScore(card, DEALER)
      showScore(DEALER)
    }
    await sleep(500)
  }
  let winner = computeWinner()
  if (winner === 'You') {
    winSound.play()
    document.querySelector('#result').textContent = 'You Won !'
    document.querySelector('#result').style.color = 'green'
    win++
    document.querySelector('#Win').textContent = win
  } else if (winner === 'Dealer') {
    bustSound.play()
    document.querySelector('#result').textContent = 'You Loss !'
    document.querySelector('#result').style.color = 'red'
    loss++
    document.querySelector('#Losses').textContent = loss
  } else {
    draw++
    document.querySelector('#Draws').textContent = draw
    document.querySelector('#result').textContent = `It's a Draw !`
  }

  document.querySelector('#stand-btn').disabled = true
  document.querySelector('#deal-btn').disabled = false
}

function computeWinner() {
  let winner
  if (YOU['score'] > 21 && DEALER['score'] > 21) {
    winner = 'Draw!'
  } else if (YOU['score'] === DEALER['score']) {
    winner = 'Draw!'
  } else if (YOU['score'] <= 21 && DEALER['score'] > 21) {
    winner = 'You'
  } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
    winner = 'Dealer'
  } else if (YOU['score'] > DEALER['score']) {
    winner = 'You'
  } else winner = 'Dealer'
  return winner
}
