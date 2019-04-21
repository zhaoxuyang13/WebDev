package com.backend.bookstore.entity.Beans;

import com.backend.bookstore.entity.BookData;

public class BookEditBean {
    String operation;
    BookData bookData;

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public BookData getBookData() {
        return bookData;
    }

    public void setBookData(BookData bookData) {
        this.bookData = bookData;
    }

    public BookEditBean(String operation, BookData bookData) {
        this.operation = operation;
        this.bookData = bookData;
    }
}
