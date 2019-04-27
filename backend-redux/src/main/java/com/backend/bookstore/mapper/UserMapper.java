package com.backend.bookstore.mapper;

import com.backend.bookstore.entity.UserData;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserMapper {
    UserData SelectByName(String UserName);
    List<UserData> SelectAllUser();
    int SelectMaxID();
    void insertNewUser(UserData data);
    int existUserName(String username);
    void UpdateUserList(UserData userData);
    void DeleteUserByID(int userID);
}
