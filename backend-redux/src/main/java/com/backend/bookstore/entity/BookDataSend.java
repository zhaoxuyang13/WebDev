package com.backend.bookstore.entity;

public class BookDataSend {

    public BookDataSend(BookData bookData) {
        this.bookID = bookData.getBookID();
        this.bookStorage = bookData.getBookStorage();
        BookInfo info = new BookInfo(bookData.getBookAuthor(),bookData.getBookDesc(),bookData.getBookISBN(),bookData.getBookName(),bookData.getBookCoverUrl(),bookData.getBookPrice());
        this.bookInfo = info;
    }
    public int getBookID() {
        return bookID;
    }

    public void setBookID(int bookID) {
        this.bookID = bookID;
    }

    public BookInfo getBookInfo() {
        return bookInfo;
    }

    public void setBookInfo(BookInfo bookInfo) {
        this.bookInfo = bookInfo;
    }

    public int getBookStorage() {
        return bookStorage;
    }

    public void setBookStorage(int bookStorage) {
        this.bookStorage = bookStorage;
    }

    private int bookID;
    private BookInfo bookInfo;
    private int bookStorage;

}
