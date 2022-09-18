const SLAB = 25;
const PUTERNIC = 30;
const ZEU = 50;

const allPomodoros = [SLAB, PUTERNIC, ZEU];

const START = 0;
const PAUSE = 1;
const STOP = 2;

const NONE = 0;
const WORK = 1;
const STAY = 2;
const PAUSED = 3;

const PAUSE_TIME = 5 * 60;

const timer = document.getElementById('timer');
const currentStatusHTML = document.getElementById('status');
const topButtons = document.querySelectorAll('.time-btn .btn');
const scoreHTML = document.getElementById('score');
const breakSound = new Audio('sounds/before_break.mp3');
const learnSound = new Audio('sounds/after_break.mp3');

let selectedTime = [false, true, false]
let currentPomodoro = PUTERNIC;
let currentTime = currentPomodoro * 60;
let timerInterval = null;
let currentStatus = NONE;
let score = 0;
let totalMinutes = 0;

for(let i = 0; i < topButtons.length; i++)
{
    topButtons[i].addEventListener("mouseover", function()
    {
        topButtons[i].classList.add('active');
    })

    topButtons[i].addEventListener("mouseout", function()
    {
        if(selectedTime[i] === false)
        {
            topButtons[i].classList.remove('active');
        }
    })

    topButtons[i].addEventListener("click", function()
    {
        for(let j = 0; j < topButtons.length; j++)
        {
            selectedTime[j] = false;
            topButtons[j].classList.remove('active');
        }

        topButtons[i].classList.add('active');
        selectedTime[i] = true;
        currentPomodoro = allPomodoros[i];
        currentTime = currentPomodoro * 60;
        if(timerInterval != 0)
            clearInterval(timerInterval);
        currentStatus = NONE;
        updateStatus(currentStatus);
        changeTime();
    })
}

function changeTime()
{
    timer.innerHTML = currentPomodoro + ':00';
}

function manip(status)
{
    switch(status)
    {
        case START:
        {
            timerInterval = setInterval(startTime, 1000);
            currentStatus = WORK;
            updateStatus(currentStatus);
            break;
        }

        case PAUSE:
        {
            clearInterval(timerInterval);
            currentStatus = PAUSED;
            updateStatus(currentStatus);
            break;
        }

        case STOP:
        {
            if(timerInterval != 0)
                clearInterval(timerInterval);

            currentTime = currentPomodoro * 60;
            timer.innerHTML = currentPomodoro + ':00';
            currentStatus = NONE;
            updateStatus(currentStatus);
            score = 0;
            scoreHTML.innerHTML = `${score} Pomodoros`;
            alert(`You learned ${totalMinutes} minutes`);
            break;
        }
    }
}

function startTime()
{
    --currentTime;
    timer.innerHTML = formatTimes(currentTime);
    
    if(currentTime == -1)
    {
        if(currentStatus == WORK)
        {
            score++;
            scoreHTML.innerHTML = `${score} Pomodoros`;
            currentStatus = STAY;
            breakSound.play();
            totalMinutes += currentPomodoro;
            startPauseTime();
        }
        else if (currentStatus == STAY) 
        {
            currentStatus = WORK;
            currentTime = currentPomodoro * 60;
            learnSound.play();
            updateStatus(currentStatus);
        }
    }
}

function startPauseTime()
{
    currentTime = PAUSE_TIME;
    updateStatus(currentStatus);
}

function updateStatus(status)
{
    switch(status)
    {
        case WORK:
        {
            currentStatusHTML.innerHTML = 'WORK';
            currentStatusHTML.style.color = '#86FF7B'
            break;
        }

        case PAUSED:
        {
            currentStatusHTML.innerHTML = 'PAUSED';
            currentStatusHTML.style.color = '#FF7B7B'
            break;
        }

        case NONE:
        {
            currentStatusHTML.innerHTML = 'WAITING';
            currentStatusHTML.style.color = 'white'
            break;
        }

        case STAY:
        {
            currentStatusHTML.innerHTML = 'BREAK';
            currentStatusHTML.style.color = '#F868FF'
            break;
        }
    }
}

function formatTimes(currTime)
{
    let min = 0;
    let sec = 0;

    min = Math.floor(currTime / 60);
    sec = Math.floor(currTime - min * 60);

    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`
}