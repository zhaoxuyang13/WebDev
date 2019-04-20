package com.backend.bookstore.mapper;

import com.backend.bookstore.entity.UserData;
import org.springframework.stereotype.Repository;


@Repository
public interface UserMapper {
    UserData SelectByName(String UserName);
    int SelectMaxID();
    void insertNewUser(UserData data);
    int existUserName(String username);
}
