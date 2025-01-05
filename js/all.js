import * as api from './apiFunction.js';
import * as func from './commonFunction.js';

/* ---------- 登入畫面相關變數 ---------- */
// input 輸入元件
const loginEmail = document.querySelector('.login input[type="email"]');
const loginPwd = document.querySelector('.login input[type="password"]');
const loginBtn = document.querySelector('.login input[type="submit"]');
// 密碼顯示按鈕
const loginpwdBtn = document.querySelector('.login .pwdTile i');

/* ---------- 註冊畫面相關變數 ---------- */
// input 輸入元件
const signUpEmail = document.querySelector('.signUp input[type="email"]');
const signUpName = document.querySelector('.signUp input[type="text"]');
const signUpPwd = document.querySelector('.signUp input[type="password"]');
const signUpPwd_Again = document.querySelector('.signUp .passwordAgain');
const signUpBtn = document.querySelector('.signUp input[type="submit"]');
// 密碼顯示按鈕
const signUppwdBtn = document.querySelector('.signUp .pwdTile i');
const signUppwdBtn_Again = document.querySelector('.signUp .pwdTile .pwdAgainBtn i');

// input 提示文字元件
const emailTxt = document.querySelector('.remindText_Email');
const nameTxt = document.querySelector('.remindText_name');
const pwdTxt = document.querySelector('.remindText_pwd');
const pwdAgainTxt = document.querySelector('.remindText_pwdAgain');

/* ---------- todolist 畫面相關變數 ---------- */
// 使用者名稱
const userName = document.querySelector('.header .user .userName');
// 登出按鈕
const signOutBtn = document.querySelector('.header .user .signOut');
// 新增 todolist 按鈕
const addTodoBtn = document.querySelector('.addForm .addTodolist');
const addTodoTxt = document.querySelector('.addForm input[type="text"]');
// nav 選項按鈕
const navAllBtn = document.querySelector('.addForm_nav .all');
const navTobeCompletedBtn = document.querySelector('.addForm_nav .tobeCompleted');
const navCompletedBtn = document.querySelector('.addForm_nav .completed');
// 清除已完成項目按鈕
const clearBtn = document.querySelector('.clearAllList');

/* ---------- 登入畫面 ---------- */
if (window.location.pathname.includes('index.html')) {
    // 密碼文字顯示的事件
    loginpwdBtn.addEventListener("click",e =>{
        e.preventDefault();

        func.passwordShow(loginpwdBtn,loginPwd);
    });

    // 登入的按鈕事件
    loginBtn.addEventListener("click",e =>{
        e.preventDefault();

        let loginEmail_txt = loginEmail.value.trim();
        let loginPwd_txt = loginPwd.value.trim();

        // email、密碼是否空白的防呆
        func.isBlank(loginEmail_txt,emailTxt);
        func.isBlank(loginPwd_txt,pwdTxt);
        // email 格式是否正確防呆
        func.isValidEmail(loginEmail_txt,emailTxt);
        // 密碼需要超過 6 個字元的防呆
        func.isValidPwd(loginPwd_txt,pwdTxt);

        // 登入 api 的函式
        api.loginAPI(loginEmail_txt,loginPwd_txt);
    });
}

/* ---------- 註冊畫面 ---------- */
if (window.location.pathname.includes('register.html')) {
    // 密碼文字顯示的事件
    signUppwdBtn.addEventListener("click",e => {
        e.preventDefault();

        func.passwordShow(signUppwdBtn,signUpPwd);
    });

    // 再次確認密碼文字顯示的事件
    signUppwdBtn_Again.addEventListener("click",e => {
        e.preventDefault();

        func.passwordShow(signUppwdBtn_Again,signUpPwd_Again);
    });

    // 註冊的按鈕事件
    signUpBtn.addEventListener("click",e => {
        e.preventDefault();

        let signUpEmail_txt = signUpEmail.value.trim();
        let signUpName_txt = signUpName.value.trim();
        let signUpPwd_txt = signUpPwd.value.trim();
        let signUpPwdAgain_txt = signUpPwd_Again.value.trim();

        // email、密碼是否空白的防呆
        func.isBlank(signUpEmail_txt,emailTxt);
        func.isBlank(signUpName_txt,nameTxt);
        func.isBlank(signUpPwd_txt,pwdTxt);
        func.isBlank(signUpPwdAgain_txt,pwdAgainTxt);
        // email 格式是否正確防呆
        func.isValidEmail(signUpEmail_txt,emailTxt);
        // 密碼需要超過 6 個字元的防呆
        func.isValidPwd(signUpPwd_txt,pwdTxt);
        func.isValidPwd(signUpPwdAgain_txt,pwdAgainTxt);
        // 密碼與再次確認密碼是否相同的防呆
        func.isPwdCommon(signUpPwd_txt,pwdTxt,signUpPwdAgain_txt,pwdAgainTxt);
        
        // 註冊 api 的函式
        api.signUpAPI(signUpEmail_txt,signUpName_txt,signUpPwd_txt,signUpPwdAgain_txt);
    });
}

/* ---------- todolist 畫面 ---------- */
if (window.location.pathname.includes('todolist.html')) {
    const nowData = JSON.parse(localStorage.getItem('nowDataList'))
    let nowEmail = nowData.email;
    let nowPwd = nowData.password;
    let nowAuthorization = "";
    
    const userList = JSON.parse(localStorage.getItem('dataList'));
    
    // 資料初始化
    userList.forEach(item => {
        if (nowEmail == item.email && nowPwd == item.password){
            userName.textContent = `${item.nickname} 的代辦`;
            nowAuthorization = item.authorization;
        }
    });
    // 使用非同步，先抓到資料再進行後續動作
    const mydata = await api.todoListAPI(nowAuthorization,"all");

    // 登出按鈕事件
    signOutBtn.addEventListener("click",e =>{
        e.preventDefault();

        // 登出前詢問
        Swal.fire({
            title: "確定要登出嗎 ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "確定",
            cancelButtonText: "取消"
          }).then((result) => {
            if (result.isConfirmed) {
                // 登出 api 函式
                api.signOutAPI(nowAuthorization);
            }
          });
    });

    // 新增待辦按鈕事件
    addTodoBtn.addEventListener("click",e => {
        e.preventDefault();

        api.insertTodoAPI(nowAuthorization,addTodoTxt.value);
    });

    navAllBtn.addEventListener("click",e => {
        const navBtn = document.querySelectorAll('.addForm_nav li a');

        navBtn.forEach(item => {
            if (item.textContent == e.target.textContent){
                item.classList.add('selected');
            }else{
                item.classList.remove('selected');
            }
        })

        api.todoListAPI(nowAuthorization,"all");
    });

    navTobeCompletedBtn.addEventListener("click",e => {
        const navBtn = document.querySelectorAll('.addForm_nav li a');

        navBtn.forEach(item => {
            if (item.textContent == e.target.textContent){
                item.classList.add('selected');
            }else{
                item.classList.remove('selected');
            }
        })

        api.todoListAPI(nowAuthorization,"tobecompleted");
    });

    navCompletedBtn.addEventListener("click",e => {
        const navBtn = document.querySelectorAll('.addForm_nav li a');

        navBtn.forEach(item => {
            if (item.textContent == e.target.textContent){
                item.classList.add('selected');
            }else{
                item.classList.remove('selected');
            }
        })

        api.todoListAPI(nowAuthorization,"completed");
    });

    clearBtn.addEventListener("click",e => {
        e.preventDefault();

        Swal.fire({
            title: "確定要清除已完成待辦項目嗎 ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "確定",
            cancelButtonText: "取消"
          }).then((result) => {
            if (result.isConfirmed) {
                api.todoListAPI(nowAuthorization,"clear");
            }
          });
        
    });
}

