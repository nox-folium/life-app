// スケジュール保存
// 時間と予定をオブジェクト格納
let items = [];

// localStorageに保存
function hozon() {
    // JSON形式
    localStorage.setItem("schedule", JSON.stringify(items));
}

// localStorageから読み込み
function yomikomi() {
    // scheduleを取得
    const saveData = localStorage.getItem("schedule");
    // データがあるとき
    if (saveData) {
        try {
            // item配列に戻す
            const data = JSON.parse(saveData);
            // 配列であることを確認してから読み込み
            if (Array.isArray(data)) {
                items = data.filter(item =>
                    item && typeof item.time === "string" && typeof item.text === "string"
                );
            }
        }
        // 読み込みに失敗したとき
        catch (error) {
            // consoleに表示
            console.error("保存データの読み込みに失敗しました", error);
            items = [];
        }
    }
}

// スケジュール追加
function tuika() {
    // 入力欄を取得
    const zikanInput = document.getElementById("zikan");
    const mokuhyouInput = document.getElementById("mokuhyou");
    // 入力を取得
    const zikan = zikanInput.value;
    const mokuhyou = mokuhyouInput.value.trim();
    // 時間の形式（00:00~23:59）に一致するか確認
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    // 一致しないときは警告
    if (!timeRegex.test(zikan)) {
        alert("正しい時間を入力してください（例: 08:30）。");
        return;
    }
    // 予定が未入力のときは警告
    if (!mokuhyou) {
        alert("予定を入力してください。");
        return;
    }

    // スケジュール追加（時間・目標・達成状況）
    items.push({time: zikan, text: mokuhyou, completed: false});
    // 時間の早い順に整列
    items.sort((a, b) => a.time.localeCompare(b.time));

    narabikae();
    hozon();
    hyouzi();

    // 入力欄を空にする
    mokuhyouInput.value = "";
}

// スケジュール削除
function sakujo(index) {
    // 確認メッセージ
    if(!confirm("このスケジュールを削除しますか？")){
        return;
    }
    // index番目の予定を削除
    items.splice(index, 1);

    hozon();
    hyouzi();
}

// スケジュール達成
function kanryou(index) {
    // 達成状況をtrueにする
    items[index].completed = true;

    // 達成した目標を一番下に移動
    const completedItem = items.splice(index, 1)[0];
    items.push(completedItem);

    narabikae();
    hozon();
    hyouzi();
}

// スケジュールの並び替え
function narabikae(){
    // 達成済みスケジュールは下に並べる（時間の早い順）
    items.sort((a,b)=> {
        return Number(a.completed === true) - Number(b.completed === true)|| a.time.localeCompare(b.time);
    });
}

// スケジュール表示
function hyouzi() {
    tasseirituHyouji();
    // 表示場所を取得
    const itiran = document.getElementById("itiran");
    // スケジュール0件のとき
    if (items.length === 0) {
        itiran.innerHTML = '<div class="empty-msg"></div>';
        return;
    }
    // HTMLとして表示
    itiran.innerHTML = items.map((item, i) => `
        <div class="list-box">
            <!-- 達成ボタン -->
            <button
                class="complete-btn"
                onclick="kanryou(${i})"
                ${item.completed ? 'disabled' : ''}>
                ${item.completed ? '達成済み' : '達成'}
            </button>

            <!-- スケジュール内容 -->
            <span class="schedule"
                style="${item.completed ? 'text-decoration: line-through; color:gray;' : ''}">
                <b>【${item.time}】</b> ${item.text}
            </span>

            <!-- 削除ボタン -->
            <button
                class="del-btn"
                onclick="sakujo(${i})">
                削除
            </button>
        </div>
    `).join('');
}

// 達成率グラフ表示
function tasseirituHyouji(){
    // 予定の件数を取得
    const total = items.length;
    // completedがtrueの予定の件数を取得
    const completedCount = items.filter(item => item.completed === true).length;
    // 予定0件のときは0％
    const rate = total === 0 ? 0 : Math.round((completedCount / total) * 100);
    // グラフの場所取得
    const tasseiritu = document.getElementById("tasseiritu");
    // HTMLとして表示
    tasseiritu.innerHTML = `
        <div class="graph-area>

            <!-- 達成率 -->
            <div class="graph=header">
                <span>達成率</apan>
                <span class="graph-rate">${rate}%</span>
            </div>

            <!-- 帯グラフ -->
            <div class="graph-bar">
                <!-- 達成率に応じて幅変化 -->
                <div class="graph-fill" style="width: ${rate}%;">
                </div>
            </div>

            <!-- 達成・未達成 -->
            <div class="graph-detail">
                <span>達成済み:${completedCount}件</span>
                <span>未達成:${total-completedCount}件</span>
            </div>
        </div>
    `;
}

// 初期処理
yomikomi();
hyouzi();
