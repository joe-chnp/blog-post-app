export const validateCreatePostData = (req, res, next) => {
    // Validation Rule ของ Requirement ก็สามารถมีได้ดังนี้

    // 1) ข้อมูล Title, Content, Category และ Length 
    // เป็นข้อมูลที่ Client จำเป็นต้องแนบมาให้
    if (!req.body.title) {
        return res.status(401).json({
             message: "กรุณาส่งข้อมูล Title ของโพสต์เข้ามาด้วย"
        })
    }
       
    if (!req.body.content) {
        return res.status(401).json({
             message: "กรุณาส่งข้อมูล Content ของโพสต์เข้ามาด้วย"
        })
    }
       
    if (!req.body.category) {
        return res.status(401).json({
             message: "กรุณาส่งข้อมูล Category ของโพสต์เข้ามาด้วย"
        })
    } 
     
    if (!req.body.length) {
        return res.status(401).json({
             message: "กรุณาส่งข้อมูล Length ของโพสต์เข้ามาด้วย"
        })
    }

    if (!req.body.status) {
        return res.status(401).json({
            message: "กรุณาส่งข้อมูล Status ของโพสต์เข้ามาด้วย"
        })
    }
       
    // 2) ข้อมูล Length จะต้องมีค่าเป็น String “short”, “long” และ “medium” เท่านั้น
    const postLengthList = ["short", "long", "medium"]
    const hasPostLengthList = postLengthList.includes(req.body.length)
    
    if (!hasPostLengthList) {
          return res.status(401).json({
             message: "กรุณาส่งข้อมูล Length ของโพสต์ตามที่กำหนด เช่น 'short', 'long' หรือ 'medium'"
         })
    }
    
    // 3) Content จะต้องมีความยาวไม่เกิน 100 ตัวอักษร
    if (req.body.content.length > 100) {
        return res.status(401).json({
             message: "กรุณาส่งข้อมูล Content ของโพสต์ตามที่กำหนดไม่เกิน 100 ตัวอักษร"
         })
    }
    
    next();
}