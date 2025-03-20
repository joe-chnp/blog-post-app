import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreatePostData } from "../middlewares/post.validation.mjs";

const blogPostRouter = Router();

blogPostRouter.post("/", [validateCreatePostData], async (req, res) => {
    // ลอจิกในการเก็บข้อมูลของโพสต์ลงในฐานข้อมูล

    // 1) Access ข้อมูลใน Body จาก Request ด้วย req.body
    const newPost = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
        published_at: new Date(),
    };

    // 2) เขียน Query เพื่อ Insert ข้อมูลโพสต์ ด้วย Connection Pool
    try {
        await connectionPool.query(
            `insert into posts (user_id, title, content, category, length, created_at, updated_at, published_at, status)
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                1,
                newPost.title,
                newPost.content,
                newPost.category,
                newPost.length,
                newPost.created_at,
                newPost.updated_at,
                newPost.published_at,
                newPost.status,
            ]
        );
    } catch {
        return res.status(500).json({
            message: "Server could not create post because database issue"
        });
    }
    
    // 3) Return ตัว Response กลับไปหา Client ว่าสร้างสำเร็จ
    return res.status(201).json({
        message: "Created post successfully"
    });
});

blogPostRouter.get("/", async (req, res) => {
    // ลอจิกในการอ่านข้อมูลโพสต์ทั้งหมดในระบบ

    // 1.1) เขียน Query เพื่ออ่านข้อมูลโพสต์ ด้วย Connection Pool
    let results

    // 2.1) Access ค่าจาก Query Parameter ที่ Client แนบมากับ HTTP Endpoint
    const category = req.query.category;
    const length = req.query.length;

    try {
        // 2.2) เขียน Query เพื่ออ่านข้อมูลโพสต์ ด้วย Connection Pool
        results = await connectionPool.query(
            `
            select * from posts
            where
                (category = $1 or $1 is null or $1 = '')
                and
                (length = $2 or $2 is null or $2 = '');
            `,
            [category, length]
        );
    } catch {
        return res.status(500).json({
            message: "Server could not read post because database issue"
        });
    }
    
    // 1.2) Return ตัว Response กลับไปหา Client
    return res.status(200).json({
        data: results.rows,
    })
});

blogPostRouter.get("/:postId", async (req, res) => {
    // ลอจิกในการอ่านข้อมูลโพสต์ด้วย Id ในระบบ

    // 1) Access ตัว Endpoint Parameter ด้วย req.params
    const postIdFromClient = req.params.postId;

    // 2) เขียน Query เพื่ออ่านข้อมูลโพสต์ ด้วย Connection Pool
    const results = await connectionPool.query(`select * from posts where post_id = $1`, [postIdFromClient]);

    // เพิ่ม Conditional logic ว่าถ้าข้อมูลที่ได้จากฐานข้อมูลเป็นค่า false (null / undefined)
    // ก็ให้ Return response ด้วย status code 404
    // พร้อมกับข้อความว่า "Server could not find a requested post (post id: x)"
    if (!results.rows[0]) {
        return res.status(404).json({
            message: `Server could not find a requested post (post id: ${postIdFromClient})`,
        });
    }

    // 3) Return ตัว Response กลับไปหา Client
    return res.status(200).json({
        data: results.rows[0],
    });
});

blogPostRouter.put("/:postId", async (req, res) => {
    // ลอจิกในการแก้ไขข้อมูลโพสต์ด้วย Id ในระบบ

    // 1) Access ตัว Endpoint Parameter ด้วย req.params
    // และข้อมูลโพสต์ที่ Client ส่งมาแก้ไขจาก Body ของ Request
    const postIdFromClient = req.params.postId;
    const updatedPost = {...req.body, updated_at: new Date()};

    // 2) เขียน Query เพื่อแก้ไขข้อมูลโพสต์ ด้วย Connection Pool
    const result = await connectionPool.query(`select * from posts where post_id = $1`, [postIdFromClient]);
    if (!result.rows[0]) {
        return res.status(404).json({
            message: "Server could not find a requested post to update"
        })
    }
    
    try{
        await connectionPool.query(
            `
            update posts
                set title = $2,
                    content = $3,
                    category = $4,
                    length = $5,
                    status = $6,
                    updated_at = $7
            where post_id = $1
            `,
            [
                postIdFromClient,
                updatedPost.title,
                updatedPost.content,
                updatedPost.category,
                updatedPost.length,
                updatedPost.status,
                updatedPost.updated_at
            ]
        )
    } catch {
        return res.status(500).json({
            message: "Server could not update post because database connection"
        })
    }
    
    // 3) Return ตัว Response กลับไปหา Client
    return res.status(200).json({
        message: "Updated post successfully"
    })
});

blogPostRouter.delete("/:postId", async (req, res) => {
    const postIdFromClient = req.params.postId;

    const result = await connectionPool.query(`select * from posts where post_id = ${postIdFromClient}`);
    if (!result.rows[0]) {
        return res.status(404).json({
            message: "Server could not find a requested post to delete"
        });
    };

    try {
        await connectionPool.query(
            `
            delete from posts
            where post_id = $1`,
            [postIdFromClient]
        );
    } catch {
        return res.status(500).json({
            message: "Server could not create post because database connection"
        });
    };
    
    return res.status(200).json({
        message: "Deleted post successfully"
    });
});

export default blogPostRouter;