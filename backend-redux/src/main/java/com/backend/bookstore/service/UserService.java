package com.backend.bookstore.service;

import com.backend.bookstore.entity.BookData;
import com.backend.bookstore.entity.BookDataSend;
import com.backend.bookstore.entity.UserData;
import com.backend.bookstore.mapper.BookMapper;
import com.backend.bookstore.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class UserService {
    @Autowired
    UserMapper userMapper;

    public UserData SelectByName(String userName){
        
        return userMapper.SelectByName(userName);
    }
    public List<UserData> SelectAllUser(){
        return userMapper.SelectAllUser();
    }

    public int SelectMaxID(){
        return userMapper.SelectMaxID();
    }

    public void insertNewUser(UserData userData) {
        userData.setUserID(SelectMaxID() + 1);
        userMapper.insertNewUser(userData);
    }
    public int existUserName(String username){
        return userMapper.existUserName(username);
    }
    public void UpdateUserList(UserData userData){
        userMapper.UpdateUserList(userData);
    }
    public void DeleteUserByID(int userID){
        userMapper.DeleteUserByID(userID);
    }
}
