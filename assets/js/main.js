class WordQuiz {
    constructor(rootElm){
        this.rootElm = rootElm;
    }

    async init() {
        await this.fetchQuizData();
        this.displayStartView();
    }

    async fetchQuizData() {
        try {
            // クイズデータを非同期で読み込む
            const response = await fetch('./assets/data/quiz.json');
            this.quizData = await response.json();
            console.log("クイズデータの読み込みに成功しました:", this.quizData);
        } catch (error) {
            console.error("初期化中にエラーが発生しました:", error);
        }
    }

    displayStartView(){
        const levelStrs = Object.keys(this.quizData);
        const optionStrs = [];
        for (const levelStr of levelStrs) {
            optionStrs.push(`<option value="${levelStr}">${levelStr}</option>`);
        }
        const html = `
            <h1>クイズゲーム</h1>
            <p>レベルを選択してください:</p>
            <select class="level-selector">
                ${optionStrs.join('')}
            </select>
            <button class="startBtn">スタート</button>
        `;
        const parentElm = document.createElement('div');
        parentElm.innerHTML = html;

        const startBtn = parentElm.querySelector('.startBtn');
        startBtn.addEventListener('click', () => {
            this.displayQuestionView();
            // const levelSelector = parentElm.querySelector('.level-selector');
            // const selectedLevel = levelSelector.value;
            // this.displayQuizView(selectedLevel);
        });

        this.replaceView(parentElm);
    }

    displayQuestionView(){
        const html = `
            <h2>クイズの問題</h2>
            <p>ここに問題が表示されます。</p>
            <button class="nextBtn">次の問題へ</button>
            <button class="retireBtn">ゲームを終了する</button>
        `;
        const parentElm = document.createElement('div');
        parentElm.className = 'question';
        parentElm.innerHTML = html;

        const retireBtn = parentElm.querySelector('.retireBtn');
        retireBtn.addEventListener('click', () => {
            this.displayResultView();
        });

        this.replaceView(parentElm);
    }

    displayResultView(){
        const html = `
            <h2>結果</h2>
            <p>ここに結果が表示されます。</p>
            <button class="restartBtn">もう一度プレイ</button>
        `;
        const parentElm = document.createElement('div');
        parentElm.className = 'result';
        parentElm.innerHTML = html;

        const restartBtn = parentElm.querySelector('.restartBtn');
        restartBtn.addEventListener('click', () => {
            this.displayStartView();
        });

        this.replaceView(parentElm);
    }


    replaceView(elm) {
        this.rootElm.innerHTML = ''; // 既存の内容をクリア
        this.rootElm.appendChild(elm);
    }
}

new WordQuiz(document.getElementById('app')).init();
