package com.backend.bookstore.web;

import com.alibaba.fastjson.JSON;
import com.backend.bookstore.entity.Beans.BookEditBean;
import com.backend.bookstore.service.BookService;
import com.backend.bookstore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;


@RestController
@RequestMapping(value = "/Order", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostConstruct
    public void init(){ }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String getOrderList(){
        return JSON.toJSONString(
                orderService.SelectAllOrderWithItems());
    }
    @RequestMapping(value = "/User", method = RequestMethod.GET)
    public String getOrderList(@RequestParam("userID") int userID){

        return JSON.toJSONString(orderService.SelectOrderWithItemsByUser(userID));
    }
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public String editOrderList(@RequestBody BookEditBean bookEditBean, HttpSession session){
        return "notAllowedNow";
    }
}







