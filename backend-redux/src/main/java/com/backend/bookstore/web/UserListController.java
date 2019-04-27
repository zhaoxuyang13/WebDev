package com.backend.bookstore.web;

import com.alibaba.fastjson.JSON;
import com.backend.bookstore.entity.Beans.BookEditBean;
import com.backend.bookstore.entity.Beans.UserEditBean;
import com.backend.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;


@RestController
@RequestMapping(value = "/UserList", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class UserListController {

    @Autowired
    private UserService userService;

    @PostConstruct
    public void init(){ }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String getUserList(){
        return JSON.toJSONString(userService.SelectAllUser());
    }
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public String editUserList(@RequestBody UserEditBean userEditBean, HttpSession session){
       switch (userEditBean.getOperation()){
           case "add":
                userService.insertNewUser(userEditBean.getUserData());
               break;
           case "changed":
                userService.UpdateUserList(userEditBean.getUserData());
               break;
           case "delete":
                userService.DeleteUserByID(userEditBean.getUserData().getUserID());
               break;
       }
       return getUserList();
    }
}







