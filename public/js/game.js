function preload(arrayOfImages) {
    $(arrayOfImages).each(function () {
        (new Image()).src = this;
    });
}

preload([
    '/images/acorn.png',
    '/images/apple.png',
    '/images/avocado.png',
    '/images/banana.png',
    '/images/cherry.png',
    '/images/coconut.png',
    '/images/kiwi.png',
    '/images/lemon.png',
    '/images/strawberry.png',
    '/images/watermelon.png',
]);

$(window).on("load", () => {
    $(".loading-header").css("display", "none");
    $(".header").css("display", "inline-block");
    $(".settings").css("display", "block");
    $(".container").css("display", "block");

    $("body").removeClass("placeholder");

    let gameImages = ["1", "1", "2", "2", "3", "3", "4", "4", "5", "5", "6", "6", "7", "7", "8", "8", "9", "9", "10", "10"];

    let buttons = [];

    class gameButton {
        constructor(id, image) {
            this.id = id;
            this.image = image;
        }
    }

    let clickedButtonIdArray = [];
    let clickedButtonArray = [];
    let openedButtonsArray = [];

    let allGameButtons = $(".image-button");

    let clickedButtonCount = 0;

    let gameHeader = $("h1");

    setTimeout(() => {
        gameHeader.text("You can start a new game by clicking here.");
        gameHeader.click(() => {
            restartGame();
        })
    }, 2000);

    let backgroundVolumeButton = $("#background-volume-button");
    let soundEffectsVolumeButton = $("#sound-effects-volume-button");
    let backgroundMusic = new Audio("/sounds/background-music.mp3");
    let winSound = new Audio("/sounds/win.mp3");
    let correctSound = new Audio("/sounds/correct.mp3");
    let wrongSound = new Audio("/sounds/wrong.mp3");
    let paused = false;
    let musicStarted = false;
    let soundEffects = true;

    backgroundMusic.volume = 0.3;
    winSound.volume = 0.6;
    correctSound.volume = 0.2;
    wrongSound.volume = 0.04;

    let bgDefault = "#bc4749";
    let bgDark = "#0a0a0a";

    let bgWinDefault = "#55a630";
    let bgWinDark = "#21371e";

    let btnBgDefault = "#d2b48c";
    let btnBgDark = "#939393";

    let btnBorderDefault = "#231F20";
    let btnBorderDark = "#ffffff";

    let isDark = false;

    let bgColor = bgDefault,
        bgWinColor = bgWinDefault,
        btnBgColor = btnBgDefault,
        btnBorderColor = btnBorderDefault;

    let win = false;

    let darkModeButton = $("#dark-mode-button");

    $("body").css("transition", "background-color 3s");

    darkModeButton.click(() => {
        if (!isDark) {
            darkModeButton.text("Dark Mode");

            setTimeout(() => {
                darkModeButton.removeClass("btn-outline-dark");
                darkModeButton.addClass("btn-outline-light");

                backgroundVolumeButton.removeClass("btn-outline-dark");
                backgroundVolumeButton.addClass("btn-outline-light");

                soundEffectsVolumeButton.removeClass("btn-outline-dark");
                soundEffectsVolumeButton.addClass("btn-outline-light");
            }, 1500);

            isDark = true;

            bgColor = bgDark;
            bgWinColor = bgWinDark;
            btnBgColor = btnBgDark;
            btnBorderColor = btnBorderDark;

            if (!win) {
                $("body").css("background-color", bgColor);
            } else {
                $("body").css("background-color", bgWinColor);
            }

            $(allGameButtons).css("transition", "background-color 3s");
            $(allGameButtons).css("transition", "border-color 3s");
            allGameButtons.css("background-color", btnBgColor);
            allGameButtons.css("border-color", btnBorderColor);
        } else {
            darkModeButton.text("Light Mode");

            setTimeout(() => {
                darkModeButton.removeClass("btn-outline-light");
                darkModeButton.addClass("btn-outline-dark");

                backgroundVolumeButton.removeClass("btn-outline-light");
                backgroundVolumeButton.addClass("btn-outline-dark");

                soundEffectsVolumeButton.removeClass("btn-outline-light");
                soundEffectsVolumeButton.addClass("btn-outline-dark");
            }, 1500);

            isDark = false;

            bgColor = bgDefault;
            bgWinColor = bgWinDefault;
            btnBgColor = btnBgDefault;
            btnBorderColor = btnBorderDefault;

            if (!win) {
                $("body").css("background-color", bgColor);
            } else {
                $("body").css("background-color", bgWinColor);
            }

            $(allGameButtons).css("transition", "background-color 3s");
            $(allGameButtons).css("transition", "border-color 3s");
            allGameButtons.css("background-color", btnBgColor);
            allGameButtons.css("border-color", btnBorderColor);
        }
    })

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffleArray(gameImages);

    const setButtonImages = () => {
        let button;
        for (let index = 0; index < gameImages.length; index++) {
            switch (gameImages[index]) {
                case "1":
                    button = new gameButton(`${index}`, "/images/watermelon.png");
                    break;
                case "2":
                    button = new gameButton(`${index}`, "/images/banana.png");
                    break;
                case "3":
                    button = new gameButton(`${index}`, "/images/apple.png");
                    break;
                case "4":
                    button = new gameButton(`${index}`, "/images/strawberry.png");
                    break;
                case "5":
                    button = new gameButton(`${index}`, "/images/acorn.png");
                    break;
                case "6":
                    button = new gameButton(`${index}`, "/images/avocado.png");
                    break;
                case "7":
                    button = new gameButton(`${index}`, "/images/cherry.png");
                    break;
                case "8":
                    button = new gameButton(`${index}`, "/images/lemon.png");
                    break;
                case "9":
                    button = new gameButton(`${index}`, "/images/coconut.png");
                    break;
                case "10":
                    button = new gameButton(`${index}`, "/images/kiwi.png");
                    break;
            }

            buttons.push(button);
        }
    }

    setButtonImages();

    const gameLoop = (clickedButton, clickedButtonId) => {
        clickedButtonArray.push(clickedButton);

        clickedButtonIdArray.push(clickedButtonId);

        if (clickedButtonIdArray.length === 2) {
            if (gameImages[clickedButtonIdArray[0]] === gameImages[clickedButtonIdArray[1]]) {
                // console.log("true");

                if (soundEffects) {
                    correctSound.play();
                } else {
                    correctSound.pause();
                }

                allGameButtons.prop('disabled', true);

                openedButtonsArray.push(clickedButtonArray[0]);
                openedButtonsArray.push(clickedButtonArray[1]);

                setTimeout(() => {
                    $(clickedButtonArray[0]).css("transition", "all .1s ease-in-out");
                    $(clickedButtonArray[0]).css("transform", "scale(1)");
                    $(clickedButtonArray[0]).css("transform", "rotateY(180deg)");
                    $(clickedButtonArray[0]).animate({
                        opacity: '0.5'
                    });

                    $(clickedButtonArray[1]).css("transition", "all .1s ease-in-out");
                    $(clickedButtonArray[1]).css("transform", "scale(1)");
                    $(clickedButtonArray[1]).css("transform", "rotateY(180deg)");
                    $(clickedButtonArray[1]).animate({
                        opacity: '0.5'
                    });

                    allGameButtons.prop('disabled', false);

                    openedButtonsArray.forEach(button => {
                        button.disabled = true;
                    });

                    clickedButtonArray = [];
                }, 1000);

                clickedButtonIdArray = [];
            } else {
                // console.log("false");

                if (soundEffects) {
                    wrongSound.play();
                } else {
                    wrongSound.pause();
                }

                clickedButtonIdArray = [];

                allGameButtons.prop('disabled', true);

                gameHeader.unbind("click");

                setTimeout(() => {
                    gameHeader.click(() => {
                        restartGame();
                    })

                    $(clickedButtonArray[0]).empty(1);
                    $(clickedButtonArray[0]).css("background", `url("/images/question-mark.png") ${btnBgColor}`);
                    $(clickedButtonArray[0]).css("background-size", "cover");
                    $(clickedButtonArray[0]).css("transition", "transform 0.1s ease-in-out");
                    $(clickedButtonArray[0]).css("transform", "scale(1)");

                    $(clickedButtonArray[1]).empty(1);
                    $(clickedButtonArray[1]).css("background", `url("/images/question-mark.png") ${btnBgColor}`);
                    $(clickedButtonArray[1]).css("background-size", "cover");
                    $(clickedButtonArray[1]).css("transition", "transform 0.1s ease-in-out");
                    $(clickedButtonArray[1]).css("transform", "scale(1)");

                    clickedButtonArray = [];

                    allGameButtons.prop('disabled', false);

                    openedButtonsArray.forEach(button => {
                        button.disabled = true;
                    });
                }, 1000);
            }
        }

        if (isFinished()) {
            win = true;

            winSound.currentTime = 0;

            if (soundEffects) {
                winSound.play();
            }

            setTimeout(() => {
                winSound.pause();
            }, 6000);

            gameHeader.unbind("click");

            $("body").css("background-color", bgWinColor);

            setTimeout(() => {
                $("body").css("background-color", bgColor);

                win = false;

                gameHeader.text("You can start a new game by clicking here.");
                gameHeader.click(() => {
                    restartGame();
                })
            }, 6000);
        }
    }

    const isFinished = () => {
        if (openedButtonsArray.length === gameImages.length) {
            gameHeader.text("You Win!");
            return true;
        } else {
            return false;
        }
    }

    const restartGame = () => {
        clickedButtonIdArray = [];
        clickedButtonArray = [];
        openedButtonsArray = [];
        buttons = [];

        shuffleArray(gameImages);
        setButtonImages();

        $(allGameButtons).empty();
        $(allGameButtons).css("background", `url("/images/question-mark.png") ${btnBgColor}`);
        $(allGameButtons).css("background-size", "cover");
        $(allGameButtons).css("transition", "transform 0.1s ease-in-out");
        $(allGameButtons).css("transform", "scale(1)");
        $(allGameButtons).prop('disabled', false);
        $(allGameButtons).animate({
            opacity: '1'
        });
    }

    $(backgroundVolumeButton).click(() => {
        if (paused) {
            backgroundMusic.volume = 0.3;

            if (clickedButtonCount > 0) {
                $(backgroundMusic)[0].play();
            }

            paused = false;

            backgroundVolumeButton.html("Music <i class='fas fa-volume-up'></i>");
        } else {
            backgroundMusic.volume = 0.0;
            $(backgroundMusic)[0].pause();

            paused = true;

            backgroundVolumeButton.html("Music <i class='fas fa-volume-mute'></i>");
        }
    })

    $(soundEffectsVolumeButton).click(() => {
        if (soundEffects) {
            winSound.volume = 0;
            winSound.pause();
            winSound.currentTime = 0;

            correctSound.volume = 0;
            correctSound.pause();
            correctSound.currentTime = 0;

            wrongSound.volume = 0;
            wrongSound.pause();
            wrongSound.currentTime = 0;

            soundEffects = false;

            soundEffectsVolumeButton.html("Effects <i class='fas fa-volume-mute'></i>");
        } else {
            winSound.volume = 0.6;
            if (win) {
                winSound.currentTime = 0;
                winSound.play();
            }
            correctSound.volume = 0.2;
            wrongSound.volume = 0.04;

            soundEffects = true;

            soundEffectsVolumeButton.html("Effects <i class='fas fa-volume-up'></i>");
        }
    })

    backgroundMusic.onended = () => {
        $(backgroundMusic)[0].play();
    }

    allGameButtons.click((event) => {
        clickedButtonCount++;

        if (!musicStarted && !paused) {
            $(backgroundMusic)[0].play();
            musicStarted = true;
        }

        let clickedButtonId = event.currentTarget.id;

        let clickedButton = event.currentTarget;
        $(clickedButton).css("transition", "transform 0.1s ease-in-out");
        $(clickedButton).css("transform", "scale(1.1)");
        $(clickedButton).css("transform", "rotateY(180deg)");

        setTimeout(() => {
            $(clickedButton).css("background", `url("") ${btnBgColor}`);

            let img = document.createElement("img");
            $(img).css("transition", "transform 0.1s ease-in-out");
            $(img).css("transform", "rotateY(180deg)");
            img.src = buttons[clickedButtonId].image;
            clickedButton.appendChild(img);
        }, 100);

        clickedButton.disabled = true;

        gameLoop(clickedButton, clickedButtonId);
    })

    // admin button click function to test end of the game
    $("#admin-button").click(() => {
        win = true;
        if (!paused) {
            winSound.play();
            setTimeout(() => {
                winSound.pause();
            }, 6000);
        } else {
            winSound.volume = 0;
            setTimeout(() => {
                winSound.play();
                winSound.pause();
            }, 6000);
        }
        gameHeader.unbind("click");
        $("body").css("transition", "background-color 3s");
        $("body").css("background-color", bgWinColor);
        winSound.onpause = () => {
            winSound.volume = 0.3;
            winSound.pause();
            $("body").css("background-color", bgColor);
            win = false;
            gameHeader.text("You can start a new game by clicking here.");
            gameHeader.click(() => {
                restartGame();
            })
        };
    })
})
