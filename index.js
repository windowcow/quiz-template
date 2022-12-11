$(document).ready(function () {
    $('#add-choice-btn').on('click', function (event) {
        addChoiceBtnClicked(event);
    });

    $('#submit-button').on('click', function (event) {
        submitClicked(event);
    });

    setQuizContents();

    $('#refresh-button').on('click', function (event) {
        refreshClicked(event);
    });
});

function setQuizContents() {
    var quizTitle = decodeURIComponent(getTitleFromURLSearchParams());
    var quizContent = decodeURIComponent(getContentFromURLSearchParams());
    updateQuizOutOfHTML(quizTitle, quizContent);
    console.log(quizTitle);

};

function getTitleFromURLSearchParams() {
    var encodedURL = window.location.href;
    var url = new URL(encodedURL);
    var urlParams = url.searchParams;
    var title = urlParams.get('title');
    return title;
};

function getContentFromURLSearchParams() {
    var encodedURL = window.location.href;
    var url = new URL(encodedURL);
    var urlParams = url.searchParams;
    var content = urlParams.get('content');
    return content;
};

function makeTitleHTMLWithText(quizTitle) {
    var titleHTML = '<div class="h3 p-3">' + quizTitle + '</div>';
    return titleHTML
};

function titleChanged(event) {
    var titleHTML = makeTitleHTMLWithText($('#quiz-title').val());
    $('#title-box').html(titleHTML);
};

function correctChoiceAndCorrectAnswer(element) {
    var rightDeco = '<div class="col-1 m-auto fw-bold text-success text-center">RIGHT</div>';

    $(element).parent().prepend(rightDeco);
    $(element).removeClass('btn-primary');
    $(element).removeClass('btn-outline-dark');
    $(element).addClass('btn-success text-white');
};

function wrongChoiceAndWrongAnswer(element) {
    var rightDeco = '<div class="col-1 m-auto fw-bold text-success text-center">RIGHT</div>';

    $(element).parent().prepend(rightDeco);
    $(element).removeClass('btn-primary');
    $(element).removeClass('btn-outline-dark');
    $(element).addClass('btn-danger text-white');
};

function makeEncodedURL(quizTitle, quizContent) {
    var url = 'https://windowcow.github.io/quiz-template/?title=' + quizTitle + '&content=' + quizContent;
    var encodedURL = encodeURI(url);
    console.log(encodedURL);
    return encodedURL;
}

function choiceClicked(event) {
    event.preventDefault();
    console.log('choiceClicked');
    event.target.classList.toggle('btn-outline-dark');
    event.target.classList.toggle('btn-primary');
    event.target.classList.toggle('text-white');
    event.target.classList.toggle('checked-as-answer');
};

function makeQuizChoiceHTMLWithText(quizChoiceText) {
    var rightChoicePattern = /-\[[oO]]\s(.*)\n/g;
    var wrongChoicePattern = /-\[[xX]]\s(.*)\n/g;
    // html fragment
    var preOfCorrect = '<div class="row"><button class="mx-auto my-1 w-75 align-self-center btn btn-outline-dark border-5" type="correct" data-toggle="button" aria-pressed="false" autocomplete="off">';
    var postOfCorrect = '</button></div>';
    var preOfWrong = '<div class="row"><button class="mx-auto my-1 w-75 align-self-center btn btn-outline-dark border-5" type="wrong" data-toggle="button" aria-pressed="false" autocomplete="off">';
    var postOfWrong = '</button></div>';

    var choicesHTML = quizChoiceText.replace(rightChoicePattern, preOfCorrect + '$1' + postOfCorrect);
    choicesHTML = choicesHTML.replace(wrongChoicePattern, preOfWrong + '$1' + postOfWrong);
    return choicesHTML
};

function submitClicked(event) {
    event.preventDefault();
    console.log('submitClicked');

    $('#choice-box button').each(function (index, element) {
        if ($(element).hasClass('checked-as-answer') && $(element).attr('type') == 'correct') {
            correctChoiceAndCorrectAnswer(element);
            element.disabled = true;
            event.target.disabled = true;

        }
        else if (!$(element).hasClass('checked-as-answer') && $(element).attr('type') == 'wrong') {
            wrongChoiceAndWrongAnswer(element);
            element.disabled = true;
            event.target.disabled = true;
        }
        else {
            var wrongDeco = '<div class="col-1 m-auto fw-bold text-danger text-center">WRONG</div>';
            $(element).parent().prepend(wrongDeco);
            $(element).remove();
            // $(element).removeClass('btn-primary');
            // $(element).removeClass('btn-outline-primary');
            // $(element).toggle('text-white');
            // $(element).addClass('btn-outline-danger');
            // $(element).append('-> THIS IS A WRONG CHOICE')
            event.target.disabled = true;

        }
    });
};

function refreshClicked(event) {
    event.preventDefault();
    console.log('refreshClicked');
    questionChangedInTextArea(event);
};

function updateQuizOutOfHTML(quizTitle, quizChoices) {
    var titleHTML = makeTitleHTMLWithText(quizTitle);
    var choicesHTML = makeQuizChoiceHTMLWithText(quizChoices);
    $('#title-box').html(titleHTML);
    $('#choice-box').html(choicesHTML);
    $('#choice-box button').on('click', function (event) {
        choiceClicked(event);
    });
};