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
        } catch (error) {
            console.error("初期化中にエラーが発生しました:", error);
        }
    }

    isLastStep() {
        const currentQuestions = this.quizData[this.gameStatus.level];
        return this.gameStatus.step === Object.keys(currentQuestions).length; 
    }

    nextStep() {
        this.clearTimer();
        // 解答結果の保持
        this.addResult();

        if (this.isLastStep()) {
            this.displayResultView();
        }else{
            this.gameStatus.step++;
            this.displayQuestionView();
        }
    }

    addResult() {
        const checkedElm = this.rootElm.querySelector('input[name="choice"]:checked');
        const answer = checkedElm ? checkedElm.value : "";
        const currentQuestion = this.quizData[this.gameStatus.level][`step${this.gameStatus.step}`];

        this.gameStatus.results.push({
            question: currentQuestion,
            selectedAnswer: answer
        });

        console.log(`解答結果:, ${answer}`);
    }

    calcScore(){
        let currentNum = 0;
        const results = this.gameStatus.results;
        for (const result of results) {
            const selected = result.selectedAnswer;
            const correrct = result.question.answer;
            if (selected === correrct) {
                currentNum++;
            }
        }
        return Math.floor((currentNum / results.length) * 100); // スコアをパーセンテージで計算
    }

    resetGame(){
        this.gameStatus.level = null; // レベルは初期化
        this.gameStatus.step = 1; // ステップは1から開始
        this.gameStatus.results = []; // プレイヤーの回答結果
        this.gameStatus.timeLimit = 0; // タイムリミットは初期化
        this.gameStatus.intervalKey = null; // SetIntervalのキーを初期化
    }

    setTimer(){
        if(this.gameStatus.intervalKey !== null) {
            throw new Error("まだタイマーが動いています。");
        }
        this.gameStatus.timeLimit = 10; // タイムリミットを10秒に設定
        this.gameStatus.intervalKey = setInterval(() => {
            this.gameStatus.timeLimit--;
            if (this.gameStatus.timeLimit === 0) {
                this.nextStep(); // タイムリミットが0になったら次のステップへ
            }else {
                this.renderTimeLimitStr(); // タイムリミットの表示を更新
            }
        }, 1000);
    }

    clearTimer() {
        clearInterval(this.gameStatus.intervalKey);
        this.gameStatus.intervalKey = null; // タイマーをクリア 
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
        this.setTimer(); // タイマーをセット
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
            </div>
            <p class="sec">残り時間: ${this.gameStatus.timeLimit}秒</p>
        `;
        const parentElm = document.createElement('div');
        parentElm.className = 'question';
        parentElm.innerHTML = html;

        const nextBtnElm = parentElm.querySelector('.nextBtn');
        nextBtnElm.addEventListener('click', () => {
            this.nextStep();
        });

        
        this.replaceView(parentElm);
    }

    renderTimeLimitStr() {
        const secElm = this.rootElm.querySelector('.sec');
        secElm.textContent = `残り時間: ${this.gameStatus.timeLimit}秒`;
    }

    displayResultView(){
        const score = this.calcScore();
        const html = `
            <h2>結果</h2>
            <p>正解率：${score}%</p>
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
