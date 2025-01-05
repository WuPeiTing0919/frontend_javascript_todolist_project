import {deleteEditBtn} from './commonFunction.js';
const apiUrl = "https://todoo.5xcamp.us/";

// 待辦事項的內容元件
const todoContent = document.querySelector('.addForm_content');
// 尚無待辦事項的內容元件
const emptyContent = document.querySelector('.addForm_Empty');

// 待辦事項清單元件
const todoListUL = document.querySelector('.addForm_todolist');
// 待辦事項的資料筆數元件
const todoListCount = document.querySelector('.allListCount');

// 已註冊成功的名單
let signUpData =[];
// 目前登入人員資料
let loginData ={};
// 待辦清單內容變數
let mytodoList = [];

// 登入
export function loginAPI(loginEmail_txt,loginPwd_txt){
    axios.post(`${apiUrl}/users/sign_in`,{
        "user": {
          "email": loginEmail_txt,
          "password": loginPwd_txt
        }
      })
      .then(res => {
        loginData = {
          "email": loginEmail_txt,
          "password": loginPwd_txt
        }
        localStorage.setItem('nowDataList',JSON.stringify(loginData));

        Swal.fire({
            icon: "success",
            title: res.data.message,
            text: "恭喜你登入成功 ! 3 秒後將進入待辦頁面，請稍後。"
        });

        // 3 秒後進入 todolist 的頁面
        const timeout = setTimeout(() => {
          window.location.href = 'todolist.html';
        },3000);
        
      })
      .catch(error => {
        Swal.fire({
            icon: "error",
            title: error.response.data.message,
            text: "資料填寫不完整或帳號不存在，謝謝。"
        });
      });
}

// 註冊
export function signUpAPI(signUpEmail_txt,signUpName_txt,signUpPwd_txt,signUpPwdAgain_txt){
    axios.post(`${apiUrl}/users`,{
      "user": {
        "email": signUpEmail_txt,
        "nickname": signUpName_txt,
        "password": signUpPwd_txt
      }
    })
    .then(res => {
      signUpData.push({
        "authorization" : res.headers.authorization,
        "email": signUpEmail_txt,
        "nickname": signUpName_txt,
        "password": signUpPwd_txt
      });
      localStorage.setItem('dataList',JSON.stringify(signUpData));
      
      Swal.fire({
          icon: "success",
          title: res.data.message,
          text: "恭喜你註冊成功 !"
      });

    })
    .catch(error => {
      Swal.fire({
          icon: "error",
          title: error.response.data.message,
          text: "資料填寫不完整或帳號已存在，謝謝。"
      });
    });
}

// 登出
export function signOutAPI(authorization){
    axios.delete(`${apiUrl}/users/sign_out`,{
        "headers": {
          "authorization" : authorization
        }
      })
      .then(res => {
        Swal.fire({
            icon: "success",
            title: res.data.message,
            text: "恭喜你登出成功 ! 3 秒後將回到首頁，請稍後。"
        });

        // 3 秒後進入 todolist 的頁面
        const timeout = setTimeout(() => {
          window.location.href = 'index.html'
        },3000);
          
      })
      .catch(error => {
        Swal.fire({
            icon: "error",
            title: error.response.data.message,
            text: "此帳號無權限進行登出，請再確認資訊，謝謝。"
        });
      });
}

// 查看目前待辦清單
export async function todoListAPI(authorization,status){
  await axios.get(`${apiUrl}/todos`,{
    "headers": {
      "authorization" : authorization
    }
  })
  .then(res => {
    let completeAt = "";
    let todoCount = 0;
    mytodoList = "";

    res.data.todos.forEach(item => {
      if (item.completed_at == null){
        todoCount ++;
      }
    })

    if (todoCount > 0){
      todoCount = 0;
      res.data.todos.forEach(item => {
        if (status != "clear") {
          if (item.completed_at != null){
            completeAt = "checked";
          }else{
            todoCount ++;
            completeAt = "";
          }
        }else{
          if (item.completed_at != null){
            completeAt = "";
            toggleTodoAPI(authorization,item.id);
          }
          todoCount ++;
        }
        
        let mydataString = `<li data-id="${item.id}">
                          <label class="checkbox">
                              <div class="checkbox_item">
                                  <input type="checkbox" ${completeAt}>
                                  <span class="checkmark"></span>
                                  <span class="checkbox_content">${item.content}</span>
                              </div>
                              <a class="edit" href="#"><i class="fa-solid fa-pen-to-square"></i></a>
                          </label>
                          <a class="delete" href="#"><i class="fa-solid fa-trash-can"></i></a>
                      </li>`;
        
        if (status == "all"){
          mytodoList += mydataString;
        }else if (status == "completed" && completeAt != ""){
          mytodoList += mydataString;
        }else if (status == "tobecompleted" && completeAt == ""){
          mytodoList += mydataString;
        }else if (status == "clear"){
          mytodoList += mydataString;
        }
        
      });

      todoListUL.innerHTML = mytodoList;
      if (status == "all"){
        todoListCount.textContent = `全部 ${res.data.todos.length} 個項目，${todoCount} 待完成項目`;
      
      }else if (status == "completed"){
        todoListCount.textContent = `全部 ${res.data.todos.length} 個項目，${res.data.todos.length - todoCount} 已完成項目`;
      
      }else if (status == "tobecompleted"){
        todoListCount.textContent = `全部 ${res.data.todos.length} 個項目，${todoCount} 待完成項目`;
      
      }else if (status == "clear"){
        todoListCount.textContent = `全部 ${res.data.todos.length} 個項目，${todoCount} 待完成項目`;
      }


      todoContent.classList.remove('none');         
      todoContent.classList.add('block');
      emptyContent.classList.add('none');
      emptyContent.classList.remove('block');

      deleteEditBtn(authorization);
    }else{
      todoContent.classList.add('none');         
      todoContent.classList.remove('block');
      emptyContent.classList.add('block');
      emptyContent.classList.remove('none');
    }
    
  })
  .catch(error => {
    Swal.fire({
        icon: "error",
        title: error.response.data.message,
        text: "此帳號無權限查看待辦事項，請再確認資訊，謝謝。"
    });
  });
}

// 新增待辦內容
export function insertTodoAPI(authorization,todoContent){
    axios.post(`${apiUrl}/todos`,{
      "todo": {
        "content": todoContent
      }
    },{
      "headers": {
        "authorization" : authorization
      }
    })
    .then(() => {
      // 新增完成後看清單
      todoListAPI(authorization,"all");
    })
    .catch(error => {
      Swal.fire({
          icon: "error",
          title: error.response.data.message,
          text: "此帳號無權限新增待辦事項，請再確認資訊，謝謝。"
      });
    });
}

// 更新待辦內容
export function updateTodoAPI(updateData,authorization,id){
  axios.put(`${apiUrl}/todos/${id}`,{
    "todo": {
      "content": updateData
    }
  },{
    "headers": {
      "authorization" : authorization
    }
  })
  .then(res => {
    Swal.fire({
      icon: "success",
      title: "更新完成",
      text: `待辦資料已更新為「${updateData}」。`
    });
    todoListAPI(authorization,"all");
  })
  .catch(error => {
    Swal.fire({
        icon: "error",
        title: error.response.data.message,
        text: "此帳號無權限更新或是無此待辦事項，請再確認資訊，謝謝。"
    });
  });
}

// 刪除待辦內容
export function deleteTodoAPI(authorization,id){
  axios.delete(`${apiUrl}/todos/${id}`,{
    "headers": {
      "authorization" : authorization
    }
  })
  .then(res => {
    Swal.fire({
      icon: "success",
      title: res.data.message
    });
    todoListAPI(authorization,"all");
  })
  .catch(error => {
    Swal.fire({
        icon: "error",
        title: error.response.data.message,
        text: "此帳號無權限刪除或是無此待辦事項，請再確認資訊，謝謝。"
    });
  });
}

// 更新待辦完成度內容
export function toggleTodoAPI(authorization,id){
  axios.patch(`${apiUrl}/todos/${id}/toggle`,{},{
    "headers": {
      "authorization" : authorization
    }
  })
  .then(res => {
    todoListAPI(authorization,"all");
  })
  .catch(error => {
    Swal.fire({
        icon: "error",
        title: error.response.data.message,
        text: "此帳號無權限修改或是無此待辦事項，請再確認資訊，謝謝。"
    });
  });
}