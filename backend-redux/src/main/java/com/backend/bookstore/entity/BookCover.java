package com.backend.bookstore.entity;

import com.mongodb.gridfs.GridFSFile;

public class BookCover {
    GridFSFile coverFile;
    String fileName;

    public BookCover() {
    }

    public GridFSFile getCoverFile() {
        return coverFile;
    }

    public void setCoverFile(GridFSFile coverFile) {
        this.coverFile = coverFile;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public BookCover(GridFSFile coverFile, String fileName) {
        this.coverFile = coverFile;
        this.fileName = fileName;
    }
}
