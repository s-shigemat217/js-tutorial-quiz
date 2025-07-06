class WordQuiz {
    constructor(rootElm){
        this.rootElm = rootElm;

        // ゲームのステータス
        this.gameStatus = {};
        this.resetGame();
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

    isLastStep() {
        const currentQuestions = this.quizData[this.gameStatus.level];
        return this.gameStatus.step === Object.keys(currentQuestions).length; 
    }

    nextStep() {
        if (this.isLastStep()) {
            this.displayResultView();
        }else{
            this.gameStatus.step++;
            this.displayQuestionView();
        }
    }

    resetGame(){
        this.gameStatus.level = null; // レベルは初期化
        this.gameStatus.step = 1; // ステップは1から開始
    }

    displayStartView(){
        const levelStrs = Object.keys(this.quizData);
        this.gameStatus.level = levelStrs[0]; // デフォルトで最初のレベルを選択
        
        // レベル選択のセレクトボックスを生成
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

        // レベル選択のセレクトボックス
        const selectorElm = parentElm.querySelector('.level-selector');
        selectorElm.addEventListener('change', (event) => {
            this.gameStatus.level = event.target.value;
        });

        // スタートボタン押下時の処理
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
        console.log("選択されたレベル:", this.gameStatus.level);
        const stepKey = `step${this.gameStatus.step}`;
        const currentQuestion = this.quizData[this.gameStatus.level][stepKey];

        const choiceStrs = [];
        for (const choice of currentQuestion.choices) {
            choiceStrs.push(`
                <lebal>
                    <input type="radio" name="choice" value="${choice}">${choice}
                </label>
            `);
        }

        const html = `
            <p>${currentQuestion.word}</p>
            <div>
                ${choiceStrs.join('')}
            </div>
            <div class="actions">
                <button class="nextBtn">解答する</button>
                <button class="retireBtn">ゲームを終了する</button>
            </div>
        `;
        const parentElm = document.createElement('div');
        parentElm.className = 'question';
        parentElm.innerHTML = html;

        const nextBtnElm = parentElm.querySelector('.nextBtn');
        nextBtnElm.addEventListener('click', () => {
            this.nextStep();
        });

        // const retireBtn = parentElm.querySelector('.retireBtn');
        // retireBtn.addEventListener('click', () => {
        //     this.displayResultView();
        // });

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
            this.resetGame();
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
