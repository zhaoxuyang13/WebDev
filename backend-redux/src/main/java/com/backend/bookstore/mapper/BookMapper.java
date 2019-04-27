package com.backend.bookstore.mapper;

import com.backend.bookstore.entity.BookData;
import com.backend.bookstore.entity.OrderItem;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookMapper {
    List<BookData> SelectAll();
    BookData SelectByID(int id);
    void RemoveFromStorage(OrderItem item);
    void UpdateBookList(BookData bookData);
    int SelectMaxBookID();
    void InsertBookList(BookData bookData);
    void DeleteBookByID(int bookID);
}
