package com.backend.bookstore.mapper;

import com.backend.bookstore.entity.BookData;
import com.backend.bookstore.entity.OrderItem;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookMapper {
    List<BookData> SelectAll();
    void RemoveFromStorage(OrderItem item);
}
