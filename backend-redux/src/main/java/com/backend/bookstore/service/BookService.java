package com.backend.bookstore.service;

import com.backend.bookstore.entity.BookData;
import com.backend.bookstore.entity.BookDataSend;
import com.backend.bookstore.entity.OrderItem;
import com.backend.bookstore.mapper.BookMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class BookService {
    @Autowired
    BookMapper bookMapper;
    public List<BookDataSend> SelectAll(){
        List<BookData> bookData= bookMapper.SelectAll();
        List<BookDataSend> selectAll = new ArrayList<BookDataSend>();
        for(BookData data: bookData){
            selectAll.add(new BookDataSend(data));
        }
        return selectAll;
    }
    public void RemoveFromStorage(ArrayList<OrderItem> items){
        for(OrderItem item: items)
            bookMapper.RemoveFromStorage(item);
    }
    public void UpdateBookList(BookData bookData){
        bookMapper.UpdateBookList(bookData);
    }

    public void InsertBookList(BookData bookData){
        bookData.setBookID(bookMapper.SelectMaxBookID()+1);
        bookMapper.InsertBookList(bookData);
    }
    public void DeleteBookByID(int bookID){
        bookMapper.DeleteBookByID(bookID);
    }
}
