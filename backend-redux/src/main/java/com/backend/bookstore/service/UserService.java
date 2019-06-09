package com.backend.bookstore.service;

import com.backend.bookstore.entity.UserData;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public interface UserService {
    UserData SelectByName(String userName);
    List<UserData> SelectAllUser();
    int SelectMaxID();
    void insertNewUser(UserData userData);
    int existUserName(String username);
    void UpdateUserList(UserData userData);
    void DeleteUserByID(int userID);
}
