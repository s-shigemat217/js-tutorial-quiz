class WordQuiz {
    constructor(rootElm){
        this.rootElm = rootElm;
    }

    async init() {
        try {
            // クイズデータを非同期で読み込む
            const response = await fetch('./assets/data/quiz.json');
            this.quizData = await response.json();
        } catch (error) {
            console.error("初期化中にエラーが発生しました:", error);
        }
    }
}

new WordQuiz(document.getElementById('app')).init();
