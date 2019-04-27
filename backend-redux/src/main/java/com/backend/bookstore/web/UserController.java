package com.backend.bookstore.web;

import com.alibaba.fastjson.JSON;
import com.backend.bookstore.entity.Beans.LoginBean;
import com.backend.bookstore.entity.Beans.SignUpBean;
import com.backend.bookstore.entity.UserData;
import com.backend.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;


class inSuccessInfo{
    private boolean isLoginSuccess = false;
    private  String errorInfo = "UNSPECIFIED_ERROR";

    public boolean isLoginSuccess() {
        return isLoginSuccess;
    }

    public void setLoginSuccess(boolean loginSuccess) {
        isLoginSuccess = loginSuccess;
    }

    public String getErrorInfo() {
        return errorInfo;
    }

    public void setErrorInfo(String errorInfo) {
        this.errorInfo = errorInfo;
    }

    public  inSuccessInfo(String error){errorInfo = error;}
}
class SuccessInfo{
    private boolean isLoginSuccess = true;

    public boolean isLoginSuccess() {
        return isLoginSuccess;
    }

    public void setLoginSuccess(boolean loginSuccess) {
        isLoginSuccess = loginSuccess;
    }

    public UserData getUserData() {
        return userData;
    }

    public void setUserData(UserData userData) {
        this.userData = userData;
    }

    private UserData userData;
    public SuccessInfo(UserData userData) {
        this.userData = userData;
    }
}

@RestController
@RequestMapping(value = "/UserAccount", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    final String NOT_FOUND_USERNAME = "NOT_FOUND_USERNAME";
    final String INCORRECT_PASSWORD = "INCORRECT_PASSWORD";
    final String BANNED_ACCOUNT = "BANNED_ACCOUNT";
    final String NOT_FOUND_SESSION = "NOT_FOUND_SESSION";
    final String DUPLICATE_USERNAME = "DUPLICATE_USERNAME";
    final String INCORRECT_EMAIL_FORMAT = "INCORRECT_EMAIL_FORMAT";
    @Autowired
    private UserService userService;

    @PostConstruct
    public void init(){ }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String get(HttpSession session){
        UserData user =(UserData) session.getAttribute("User");
        if(user == null || !(boolean)session.getAttribute("isLogin")){
            System.out.println("no session recording");
            inSuccessInfo info = new inSuccessInfo(NOT_FOUND_SESSION);
            return JSON.toJSONString(info);
        }
        System.out.println(user.getUsername());
        SuccessInfo info = new SuccessInfo(user);
        return JSON.toJSONString(info);
    }

    @RequestMapping(value = "/Logout",method = RequestMethod.GET)
    public String Logout(HttpSession session){
        System.out.println("out");
        session.setAttribute("isLogin",false);
        session.removeAttribute("User");
        session.removeAttribute("Cart");
        session.invalidate();
        return "{ \"info\": \"logoutSuccess\"}";
    }
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public String postLogin(@RequestBody LoginBean loginBean,HttpSession session){
        UserData userData = userService.SelectByName(loginBean.getUsername());
        if(userData == null){
            System.out.println("not find user" + loginBean.getUsername());
            inSuccessInfo info = new inSuccessInfo(NOT_FOUND_USERNAME);
            return JSON.toJSONString(info);
        }
        else if(userData.getUserAuth().equals("banned")){
            System.out.println("BannedAccount");
            inSuccessInfo info = new inSuccessInfo(BANNED_ACCOUNT);
            return JSON.toJSONString(info);
        }
        else if(!userData.getPassword().equals(loginBean.getPassword())) {
            System.out.println("wrong pswd.");
            inSuccessInfo info = new inSuccessInfo(INCORRECT_PASSWORD);
            return JSON.toJSONString(info);
        }
        else {
            System.out.println("success as :"+ userData.getUserAuth());
            userData.setPassword(null);  // for safety
            session.setAttribute("User",userData);
            session.setAttribute("isLogin",true);
            SuccessInfo info = new SuccessInfo(userData);
            return JSON.toJSONString(info);
        }
    }
    @RequestMapping(value = "/SignUp", method = RequestMethod.POST)
    public String postSignUp(@RequestBody SignUpBean signUpBean,HttpSession session){
        if(userService.existUserName(signUpBean.getUsername()) > 0){
            inSuccessInfo info = new inSuccessInfo(DUPLICATE_USERNAME);
            return JSON.toJSONString(info);
        }
        if(!rightEmailFormat(signUpBean.getEmail())){
            inSuccessInfo info = new inSuccessInfo(INCORRECT_EMAIL_FORMAT);
            return JSON.toJSONString(info);
        }
        int nextID = userService.SelectMaxID() + 1;
        UserData userData = new UserData(nextID,signUpBean.getUsername(),signUpBean.getEmail(),signUpBean.getPassword(),"user");
        userService.insertNewUser(userData);
        LoginBean loginBean = new LoginBean(userData.getUsername(),userData.getPassword());
        return postLogin(loginBean,session);
    }
    boolean rightEmailFormat(String email){
        return email.matches(".*@.*"); // simple format check
    }

}

