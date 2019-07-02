package com.backend.bookstore.service;

import com.backend.bookstore.entity.BookCover;
import com.backend.bookstore.entity.BookData;
import com.backend.bookstore.entity.BookDataSend;
import com.backend.bookstore.entity.OrderItem;
import com.backend.bookstore.mapper.BookMapper;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;


@Service
public interface BookService {

    List<BookDataSend> SelectAll();
    BookData SelectByID(int id);
    void RemoveFromStorage(ArrayList<OrderItem> items);
    void UpdateBookList(BookData bookData);
    void InsertBookList(BookData bookData);
    void DeleteBookByID(int bookID);
    GridFsResource findCoverByFileName(String filename);
    void saveCover(MultipartFile file,String filename) throws Exception ;
    void deleteCover(String filename);
}
