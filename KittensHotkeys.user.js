// ==UserScript==
// @name         Kittens Hotkeys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate tasks in Kittens Game
// @author       chrisdfrey
// @match        https://bloodrizer.ru/games/kittens/
// @grant        none
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

// avoids fetching these things every time when needed; set in onLoad
let shatter;
let lev;

function doShatter(amt) {
    shatter.controller.doShatterAmt(shatter.model,amt);
}

const desiredCycle = 5; // cycle to stay on when shattering

function shatterAndTrade() {
    while (game.calendar.cycleYear != 0) {
        doShatter(1);
    }
    while (game.calendar.cycle != desiredCycle) {
        doShatter(5);
        game.religion.praise();
        game.village.huntAll();
    }

    const maxHeat = game.getEffect("heatMax");
    while (game.time.heat <= (maxHeat-250)) {
        for (let i=0; i<10; i++) {
            doShatter(5);
            game.religion.praise();
            if (i != 9) {
                game.village.huntAll(); // need catpower for trade
            }
        }

        game.diplomacy.tradeAll(lev);
        //game.craftAll("eludium");
    }
}

function onLoad() {
    document.onkeyup = function(e) {
        if (e.key === 'q') {
            game.village.huntAll();
            game.religion.praise();
            //game.craftAll("parchment");
            //game.craftAll("manuscript");
            //game.craftAll("compedium");
            //game.craftAll("blueprint");
        }
    }

    shatter = game.timeTab.cfPanel.children[0].children[0];
    lev = game.diplomacy.get("leviathans");

    setInterval(() => {
        if ((game.time.heat === 0) && (game.calendar.day >= 0)) {
            shatterAndTrade();
        }
    }, 1000 );

    console.log("Kittens Hotkeys loaded");
}

waitForKeyElements('#game[style=""]', onLoad, bWaitOnce=true);
