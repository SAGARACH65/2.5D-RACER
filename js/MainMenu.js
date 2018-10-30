class MainMenu {
    constructor() {

    }

    addListeners() {
        document.getElementsByClassName('play-game')[0].addEventListener("click", function () {
            window.location.href = "game.html";
        });

    }
}


let mainMenu = new MainMenu();

mainMenu.addListeners();