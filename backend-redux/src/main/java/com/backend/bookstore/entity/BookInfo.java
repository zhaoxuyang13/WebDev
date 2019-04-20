package com.backend.bookstore.entity;

public class BookInfo {
    public BookInfo(String bookAuthor, String bookDesc, String bookISBN, String bookName, String bookCoverUrl, double bookPrice) {
        this.bookAuthor = bookAuthor;
        this.bookDesc = bookDesc;
        this.bookISBN = bookISBN;
        this.bookName = bookName;
        this.bookCoverUrl = bookCoverUrl;
        this.bookPrice = bookPrice;
    }
    public BookInfo() {}
    public String getBookAuthor() {
        return bookAuthor;
    }

    public void setBookAuthor(String bookAuthor) {
        this.bookAuthor = bookAuthor;
    }

    public String getBookDesc() {
        return bookDesc;
    }

    public void setBookDesc(String bookDesc) {
        this.bookDesc = bookDesc;
    }

    public String getBookISBN() {
        return bookISBN;
    }

    public void setBookISBN(String bookISBN) {
        this.bookISBN = bookISBN;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public String getBookCoverUrl() {
        return bookCoverUrl;
    }

    public void setBookCoverUrl(String bookCoverUrl) {
        this.bookCoverUrl = bookCoverUrl;
    }

    public double getBookPrice() {
        return bookPrice;
    }

    public void setBookPrice(int bookPrice) {
        this.bookPrice = bookPrice;
    }

    private String bookAuthor;
    private String bookDesc;
    private String bookISBN;
    private String bookName;
    private String bookCoverUrl;
    private double bookPrice;
}
