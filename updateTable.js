const express = require('express');
const fs =require('fs');

const update = express();

update.set('view engine','ejs')

function upadtaeTable(datas) {
    let tableRows = '';
    datas.forEach((data, index) => {
        tableRows += `
            <tr id="row_<%= index + 1 %>">
                <td><%= index + 1 %></td>
                <td><%= data.name %></td>
                <td><%= data.age %></td>
                <td><%= data.phone %></td>
                <td><%= data.email %></td>
                <td>
                    <form action="/Edit" onsubmit="return reload()">
                        <input type="hidden" name="rowindex" value="<%=index + 1 %>">
                        <button type="submit" style="width:50%;height:25px; background-color:darkslategray;font-family: sans-serif;  border:none;color:white;margin:0 0 0 25%;">
                            Edit
                        </button>
                    </form>
                </td>
                <td>
                    <form action="/delete" method="post">
                        <input type="hidden" name="rowindex" value="<%=index + 1 %>">
                        <button type="submit" style="width:50%;height:25px;font-family: sans-serif; background-color:brown;border:none;color:white;margin:0 0 0 25%;">
                            Delete
                        </button>
                    </form>
                </td>
            </tr>`;
    });
    updatedpage = Home.replace(`<tbody style="border:2px solid black;background-color:skyblue;"></tbody>`, `<tbody style="border:2px solid black;background-color:skyblue;"><%=tableRows %></tbody>`);
    return updatedpage;
}

module.exports = upadtaeTable;