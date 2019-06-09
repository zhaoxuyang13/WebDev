package com.backend.bookstore.serviceImpl;

import com.backend.bookstore.entity.BookData;
import com.backend.bookstore.entity.BookDataSend;
import com.backend.bookstore.entity.OrderItem;
import com.backend.bookstore.mapper.BookMapper;
import com.backend.bookstore.service.BookService;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.*;


@Service
public class BookServiceImpl implements BookService {
    @Autowired
    BookMapper bookMapper;
    @Autowired
    GridFsTemplate gridFsTemplate;
    @Autowired
    GridFSBucket gridFSBucket;

    public List<BookDataSend> SelectAll(){
        List<BookData> bookData= bookMapper.SelectAll();
        List<BookDataSend> selectAll = new ArrayList<BookDataSend>();
        for(BookData data: bookData){
            selectAll.add(new BookDataSend(data));
        }
        return selectAll;
    }
    public BookData SelectByID(int id){
        return  bookMapper.SelectByID(id);
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


    public GridFsResource findCoverByFileName(String filename) {
        Query query = Query.query(Criteria.where("filename").is(filename));

        GridFSFile file = gridFsTemplate.findOne(query);
        if(file == null) return null;
        return new GridFsResource(file, gridFSBucket.openDownloadStream(file.getObjectId()));
    }

    @Override
    public void saveCover(MultipartFile file, String filename) throws Exception {
        InputStream inputStream = file.getInputStream();
        gridFsTemplate.store(inputStream,filename);
    }

}
