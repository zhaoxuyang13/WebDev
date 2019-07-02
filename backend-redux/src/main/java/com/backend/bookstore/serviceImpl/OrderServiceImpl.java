package com.backend.bookstore.serviceImpl;

import com.backend.bookstore.entity.Beans.DatePairBean;
import com.backend.bookstore.entity.Order;
import com.backend.bookstore.entity.OrderItem;
import com.backend.bookstore.entity.OrderWithItems;
import com.backend.bookstore.mapper.OrderMapper;
import com.backend.bookstore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    OrderMapper orderMapper;
    public void insertNewOrder(Order order){
         orderMapper.insertNewOrder(order);
    }

    public void insertNewOrderItem(OrderItem orderItem){
        orderMapper.insertNewOrderItem(orderItem);
    }

    public List<OrderItem> SelectOrderItemsByOrderID(int orderID){
        return orderMapper.SelectOrderItemsByOrderID(orderID);
    }
    public List<Order> SelectOrderByUser(int userID){
        return orderMapper.SelectOrderByUser(userID);
    }
    public List<OrderWithItems> SelectOrderWithItemsByUser(int userID){
        List<Order> orders = orderMapper.SelectOrderByUser(userID);
        return getOrderWithItemsByOrderList(orders);
    }
    public List<Order> SelectAllOrders(){
        return orderMapper.SelectAllOrders();
    }
    public List<OrderWithItems> SelectAllOrderWithItems(){
        List<Order> orders = orderMapper.SelectAllOrders();
        return getOrderWithItemsByOrderList(orders);
    }

    private List<OrderWithItems> getOrderWithItemsByOrderList(List<Order> orders) {
        if(orders == null) return null;
        List<OrderWithItems> orderWithItems = new ArrayList<>();
        for(Order order : orders){
            List<OrderItem> items = orderMapper.SelectOrderItemsByOrderID(order.getOrderID());
            if(items != null) {
                orderWithItems.add(
                        new OrderWithItems(order, items)
                );
             }
        }
        return orderWithItems;
    }

    public List<OrderWithItems> SelectByTimeRange(int userID, DatePairBean datePairBean){
        List<Order> orders=orderMapper.SelectByTimeRange(userID,datePairBean.getStartTime(),datePairBean.getEndTime());
        return getOrderWithItemsByOrderList(orders);
    }

    public List<OrderWithItems> SelectAllByTimeRange(DatePairBean datePairBean) {
        List<Order> orders = orderMapper.SelectAllByTimeRange(datePairBean.getStartTime(),datePairBean.getEndTime());
        return getOrderWithItemsByOrderList(orders);
    }

}
