package com.backend.bookstore.web;

import com.alibaba.fastjson.JSON;
import com.backend.bookstore.entity.Beans.BookEditBean;
import com.backend.bookstore.service.BookService;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.sun.deploy.net.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;


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

    @RequestMapping(value = "/bookCover", method = RequestMethod.GET)
    public void sendBookCover(@RequestParam("bookID") int bookID, HttpServletResponse response) throws Exception {
        String filename = "ID_" + bookID;
        GridFsResource cover = bookService.findCoverByFileName(filename);
        if(cover == null){
            System.out.println("find nothing of " + filename);
        }

        InputStream inputStream = cover.getInputStream();
        BufferedImage image = ImageIO.read(inputStream);
        ImageIO.write(image,"JPG",response.getOutputStream());
    }
    @RequestMapping(value = "/bookCover",method = RequestMethod.POST)
    public String getBookCover(@RequestParam("bookID") int bookID,@RequestParam("file") MultipartFile file, HttpSession session) throws Exception{
        String filename = "ID_" + bookID;
        System.out.println(bookID);
        // 文件大小控制
        System.out.println("Size: " + file.getSize());
        if (file.getSize() > 500*1024) {
            return "文件过大";
        }
        // 文件格式控制

        Image image = ImageIO.read(file.getInputStream());
        if (image == null)
            return "不支持的文件类型";

        bookService.saveCover(file,filename);
        System.out.println("File saved." + filename);
        return "success";
    }
}







