class WordQuiz {
    constructor(){
        console.log("WordQuizクラスのインスタンスが作成されました");
    }

    async init() {
        try {
            // クイズデータを非同期で読み込む
            const response = await fetch('./assets/data/quiz.json');
            this.quizDara = await response.json();
            console.log("クイズデータが正常に読み込まれました:", this.quizDara);
        } catch (error) {
            console.error("初期化中にエラーが発生しました:", error);
        }
        
    }
}

new WordQuiz().init();