package com.backend.bookstore.serviceImpl;

import com.backend.bookstore.entity.UserData;
import com.backend.bookstore.mapper.UserMapper;
import com.backend.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class UserServiceImpl implements UserService {
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
