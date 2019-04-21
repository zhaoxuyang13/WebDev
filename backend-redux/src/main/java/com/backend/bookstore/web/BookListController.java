package com.backend.bookstore.web;

import com.alibaba.fastjson.JSON;
import com.backend.bookstore.entity.Beans.BookEditBean;
import com.backend.bookstore.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.HttpSession;


@RestController
@RequestMapping(value = "/BooksList", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class BookListController {

    @Autowired
    private BookService bookService;

    @PostConstruct
    public void init(){ }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String getBookList(){
        return JSON.toJSONString(bookService.SelectAll());
    }
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public String editBookList(@RequestBody BookEditBean bookEditBean, HttpSession session){
        switch (bookEditBean.getOperation()){
            case "add":
                bookService.InsertBookList(bookEditBean.getBookData());
                break;
            case "changed":
                bookService.UpdateBookList(bookEditBean.getBookData());
                break;
            case "delete":
                bookService.DeleteBookByID(bookEditBean.getBookData().getBookID());
                break;
        }
        return getBookList();
    }
}







