import * as api from './apiFunction.js';

// 密碼文字顯示的函式
export function passwordShow(pwdBtn,passwordTxt){
    if (pwdBtn.getAttribute("class") == "fa-solid fa-eye-slash"){
        pwdBtn.setAttribute("class","fa-solid fa-eye");
        passwordTxt.setAttribute("type","text");
    }else{
        pwdBtn.setAttribute("class","fa-solid fa-eye-slash");
        passwordTxt.setAttribute("type","password");
    }
}

// 是否空白的函式
export function isBlank(Item_txt,remindTxt){
    if (Item_txt == ""){
        remindTxt.classList.add("visibility");
        remindTxt.textContent = "此欄位不可為空";
    }else{
        remindTxt.classList.remove("visibility");
    }
}

// email 格式是否正確的函式
export function isValidEmail(Email_txt,emailTxt) {
    // Email 格式的正則表達式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (Email_txt != ""){
        if (emailRegex.test(Email_txt) == false){
            emailTxt.classList.add("visibility");
            emailTxt.textContent = "此欄位不符合 Email 格式";
        }else{
            emailTxt.classList.remove("visibility");
        }
    } 
}

// 密碼需要超過 6 個字元的函式
export function isValidPwd(Pwd_txt,pwdTxt) {
    if (Pwd_txt != ""){
        if (Pwd_txt.length < 6){
            pwdTxt.classList.add("visibility");
            pwdTxt.textContent = "此欄位密碼需要大於 6 個字元";
        }else{
            pwdTxt.classList.remove("visibility");
        }
    }
}

// 密碼與再次確認密碼是否相同的函式
export function isPwdCommon(Pwd_txt,pwdTxt,PwdAgain_txt,PwdAgainTxt) {
    if (Pwd_txt != "" && PwdAgain_txt != ""){
        if (Pwd_txt != PwdAgain_txt){
            let content = '此欄位密碼與再次確認密碼的欄位不同';

            pwdTxt.classList.add("visibility");
            PwdAgainTxt.classList.add("visibility");
            pwdTxt.textContent = content;
            PwdAgainTxt.textContent = content;
        }else{
            pwdTxt.classList.remove("visibility");
            PwdAgainTxt.classList.remove("visibility");
        }
    }
}

// 更新、刪除按鈕事件
export function deleteEditBtn(authorization) {
    const todoListUL = document.querySelector('.addForm_todolist');
    const todolistID = todoListUL.querySelectorAll('li');

    const toggleBtn = todoListUL.querySelectorAll('.checkbox input[type="checkbox"]');
    const editBtn = todoListUL.querySelectorAll('.edit');
    const deleteBtn = todoListUL.querySelectorAll('.delete');

    // 刪除按鈕
    deleteBtn.forEach((item,index) => {
        item.addEventListener("click",e => {
            e.preventDefault();

            Swal.fire({
                title: "確定要刪除嗎 ?",
                icon: "question",
                text: `選擇刪除的項目為「${todolistID[index].querySelector('.checkbox_content').textContent}」`,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "確定",
                cancelButtonText: "取消"
                }).then((result) => {
                if (result.isConfirmed) {
                    api.deleteTodoAPI(authorization,todolistID[index].dataset.id);
                }
            });
        })
    });

    // 更新按鈕
    editBtn.forEach((item,index) => {
        item.addEventListener("click",e => {
            e.preventDefault();

            Swal.fire({
                title: "確定要更新嗎 ?",
                icon: "question",
                input: "text",
                text: `選擇更新的項目「${todolistID[index].querySelector('.checkbox_content').textContent}」，請在下方方塊中輸入想更新的內容。`,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "確定",
                cancelButtonText: "取消"
                }).then((result) => {
                if (result.isConfirmed) {
                    if (result.value != ""){
                        api.updateTodoAPI(result.value,authorization,todolistID[index].dataset.id);
                    }else{
                        Swal.fire({
                            icon: "error",
                            title: "未輸入修改項目",
                            text: "請填寫修改項目再按下確認，謝謝。"
                        });
                    }
                }
            });
            
        })
    });

    // 更新待辦完成度按鈕
    toggleBtn.forEach((item,index) => {
        item.addEventListener("click",e => {
            e.preventDefault();

            api.toggleTodoAPI(authorization,todolistID[index].dataset.id);
        })
    });
}

  