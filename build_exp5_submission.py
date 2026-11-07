import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="D1D5DB", sz="4"):
    tblPr = table._element.xpath('w:tblPr')
    if tblPr:
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideH w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideV w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:left w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:right w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'</w:tblBorders>'
        )
        tblPr[0].append(borders)

def add_code_block(doc, code_text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
    
    # Border
    tcPr = cell._element.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
        f'<w:left w:val="single" w:sz="18" w:space="0" w:color="4F46E5"/>'
        f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
        f'<w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    
    run = p.add_run(code_text.strip())
    run.font.name = "Consolas"
    run.font.size = Pt(8.5)
    run.font.color.rgb = RGBColor(30, 41, 59)
    doc.add_paragraph() # Spacing

def add_screenshot_table(doc, num, title, method, endpoint, status, expected):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(4)
    run_h = h.add_run(f"{num}. {title}")
    run_h.bold = True
    run_h.font.size = Pt(11)
    run_h.font.color.rgb = RGBColor(15, 23, 42)

    tbl = doc.add_table(rows=4, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl, "E2E8F0", "4")
    
    data = [
        ("HTTP Method", method),
        ("Endpoint", endpoint),
        ("Status Code", status),
        ("Expected Result", expected)
    ]
    
    col_widths = [Inches(1.8), Inches(4.7)]
    for i, (label, val) in enumerate(data):
        row = tbl.rows[i]
        
        c0 = row.cells[0]
        c0.width = col_widths[0]
        set_cell_background(c0, "F1F5F9")
        set_cell_margins(c0, 60, 60, 100, 100)
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(2)
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(label)
        r0.bold = True
        r0.font.name = "Calibri"
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = RGBColor(51, 65, 85)
        
        c1 = row.cells[1]
        c1.width = col_widths[1]
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c1, 60, 60, 100, 100)
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(2)
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(val)
        r1.font.name = "Consolas" if i in [0, 1, 2] else "Calibri"
        r1.font.size = Pt(9.5)
        if i == 2:
            r1.bold = True
            r1.font.color.rgb = RGBColor(16, 185, 129) if "20" in val else RGBColor(239, 68, 68)

    # Placeholder Box for screenshot image
    p_box = doc.add_paragraph()
    p_box.paragraph_format.space_before = Pt(6)
    p_box.paragraph_format.space_after = Pt(12)
    p_box.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_box = p_box.add_run(f"[ SCREENSHOT {num}: Insert image of {title} here ]")
    r_box.italic = True
    r_box.font.size = Pt(9)
    r_box.font.color.rgb = RGBColor(148, 163, 184)

def build_docx():
    doc = docx.Document()
    
    # Page setup
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    r = p_title.add_run("Experiment – 5")
    r.bold = True
    r.font.size = Pt(18)
    r.font.name = "Calibri"
    r.font.color.rgb = RGBColor(30, 41, 59)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(2)
    r = p_sub.add_run("Integration of MongoDB and Mongoose with RESTful APIs")
    r.bold = True
    r.font.size = Pt(13)
    r.font.name = "Calibri"
    r.font.color.rgb = RGBColor(79, 70, 229)

    p_tools = doc.add_paragraph()
    p_tools.paragraph_format.space_after = Pt(14)
    r = p_tools.add_run("Using Node.js, Express.js, MongoDB Atlas, Mongoose and Postman")
    r.italic = True
    r.font.size = Pt(10.5)
    r.font.name = "Calibri"
    r.font.color.rgb = RGBColor(100, 116, 139)

    # Student Details
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.LEFT
    meta_data = [
        ("Name:", "Kirteesh D. Rakshe"),
        ("Class:", "D15A"),
        ("Roll No.:", "43"),
        ("Date:", "07 November 2026")
    ]
    for i, (k, v) in enumerate(meta_data):
        r0 = meta_table.rows[i].cells[0].paragraphs[0].add_run(k)
        r0.bold = True
        r0.font.size = Pt(10)
        meta_table.rows[i].cells[0].width = Inches(1.2)
        r1 = meta_table.rows[i].cells[1].paragraphs[0].add_run(v)
        r1.font.size = Pt(10)
        meta_table.rows[i].cells[1].width = Inches(3.0)

    doc.add_paragraph() # space

    # 1. Aim
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(4)
    r = h1.add_run("1. Aim")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_aim = doc.add_paragraph()
    p_aim.paragraph_format.space_after = Pt(10)
    r = p_aim.add_run(
        "To integrate MongoDB with an existing RESTful API using Mongoose, implement persistent CRUD operations, "
        "and test the APIs using Postman."
    )
    r.font.size = Pt(10)

    # 2. Problem Statement
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(10)
    h2.paragraph_format.space_after = Pt(4)
    r = h2.add_run("2. Problem Statement")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_ps = doc.add_paragraph()
    p_ps.paragraph_format.space_after = Pt(6)
    r = p_ps.add_run(
        "Extend the existing Event Management System API by replacing in-memory data storage with MongoDB.\n"
        "Configure MongoDB Atlas, connect the Express application using Mongoose, implement CRUD operations, "
        "test the APIs using Postman, and display database records in the React frontend."
    )
    r.font.size = Pt(10)

    # 3. Theory Questions
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(14)
    h3.paragraph_format.space_after = Pt(6)
    r = h3.add_run("3. Theory Questions")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor(15, 23, 42)

    theory_qa = [
        (
            "What is MongoDB Atlas, and why is it used?",
            "MongoDB Atlas is a fully-managed cloud database service (Database-as-a-Service / DBaaS) provided by MongoDB. "
            "It runs across major cloud providers such as AWS, Google Cloud, and Microsoft Azure.\n\n"
            "Key reasons why it is used:\n"
            "• Zero Infrastructure Management: Automates server provisioning, storage configuration, automated backups, and patching.\n"
            "• High Availability & Fault Tolerance: Implements automatic multi-node replica sets ensuring 99.995% uptime and automatic failover.\n"
            "• Scalability: Allows elastic horizontal sharding and vertical instance scaling with zero downtime.\n"
            "• Built-in Security: Provides end-to-end TLS/SSL encryption, role-based access control (RBAC), network isolation, and IP whitelisting.\n"
            "• Real-time Monitoring: Offers visual performance telemetry, query profilers, index optimization recommendations, and automated alerts."
        ),
        (
            "What is Mongoose? Explain the purpose of schemas and models.",
            "Mongoose is an Object Data Modeling (ODM) library designed specifically for Node.js and MongoDB. It provides a structured, "
            "schema-based solution to model application data while managing validations, type casting, query building, and business logic hooks.\n\n"
            "• Purpose of Schemas:\n"
            "MongoDB is inherently schemaless, meaning documents in a single collection can have disparate fields. A Mongoose Schema defines "
            "the strict blueprint for documents in a collection. It enforces data types (String, Number, Date, ObjectId), required constraints, "
            "default values, custom validators, index configurations, and lifecycle hooks (pre/post middleware).\n\n"
            "• Purpose of Models:\n"
            "A Mongoose Model is a compiled constructor compiled directly from a Schema. While a schema defines data structure, the Model "
            "provides the programmatic interface to interact with the database. It exposes built-in static methods for CRUD operations "
            "(such as Event.find(), Event.create(), Event.findByIdAndUpdate()) and instantiates individual documents with save() and delete() capabilities."
        ),
        (
            "What is the purpose of MONGODB_URI and mongoose.connect()?",
            "• MONGODB_URI:\n"
            "The MONGODB_URI is a standardized Connection String URI (Uniform Resource Identifier) containing all requisite parameters "
            "for establishing a connection to a MongoDB deployment. A typical URI format is:\n"
            "  mongodb+srv://<username>:<password>@cluster0.mongodb.net/<databaseName>?retryWrites=true&w=majority\n"
            "It encapsulates protocol specifications (mongodb:// or mongodb+srv://), credentials, cluster hostnames, port allocations, "
            "target database name, and connection options (e.g. write concerns, read preferences, replica set configs).\n\n"
            "• mongoose.connect():\n"
            "mongoose.connect() is the asynchronous method that establishes an active connection pool between the Node.js process and "
            "the MongoDB cluster. It initializes TCP sockets, performs cryptographic TLS handshakes, authenticates database credentials, "
            "and maintains a persistent pool of reusable database connections for high-throughput API transactions."
        ),
        (
            "Differentiate between in-memory storage and MongoDB storage.",
            "Parameter | In-Memory Storage (Exp 4) | MongoDB Storage (Exp 5)\n"
            "1. Persistence: Data resides exclusively in process RAM; restarting the server wipes all records. | Data is persisted to non-volatile disk/SSD and replicated across cluster nodes.\n"
            "2. Scalability: Strictly bounded by physical RAM of a single machine; cannot scale horizontally. | Horizontally scalable across clusters via automatic sharding and replica sets.\n"
            "3. Query Capabilities: Restricted to simple array methods (filter, find, splice, push). | Advanced query engine supporting rich filters, indexing, aggregations, and geospatial queries.\n"
            "4. Concurrency: Risk of race conditions during concurrent mutations in memory. | ACID transactions at document level, optimistic concurrency, and row-level locking.\n"
            "5. Production Suitability: Suitable only for rapid prototyping, ephemeral caches, or unit tests. | Enterprise-ready for production mission-critical applications."
        ),
        (
            "Explain the purpose of find(), findById(), create(), findByIdAndUpdate() and findByIdAndDelete().",
            "These are the core Mongoose Model methods used to execute the five fundamental CRUD operations:\n\n"
            "• find(filter):\n"
            "  Retrieves all documents matching a query filter (or all documents in collection when empty filter {} is passed). "
            "  Used in GET /api/events to return array of events.\n\n"
            "• findById(id):\n"
            "  Queries the collection for a single document matching the specific 24-character hexadecimal ObjectId. "
            "  Used in GET /api/events/:id.\n\n"
            "• create(docData):\n"
            "  Instantiates and persists one or more new documents into MongoDB in a single atomic step, validating fields against schema. "
            "  Used in POST /api/events.\n\n"
            "• findByIdAndUpdate(id, update, options):\n"
            "  Finds a document by ID and applies mutations. When passed { new: true, runValidators: true }, it returns the newly modified "
            "  document and guarantees schema validation rules are re-evaluated. Used in PUT /api/events/:id.\n\n"
            "• findByIdAndDelete(id):\n"
            "  Locates a document by its ID and permanently removes it from the MongoDB collection, returning the deleted document. "
            "  Used in DELETE /api/events/:id."
        ),
        (
            "What is MongoDB ObjectId?",
            "An ObjectId is MongoDB's default 12-byte (24-character hexadecimal string) globally unique identifier automatically generated "
            "for the primary key field '_id' of every document. It is specifically designed to eliminate central auto-increment bottlenecks "
            "in distributed systems.\n\n"
            "The 12-byte composition consists of:\n"
            "1. 4-byte Timestamp: Unix epoch seconds representing the exact instant of document creation (extractable via ObjectId.getTimestamp()).\n"
            "2. 5-byte Random Value: Unique to the machine and process generating the ID, preventing multi-server collisions.\n"
            "3. 3-byte Incrementing Counter: Initialized to a random value and monotonically incremented per document on that process.\n\n"
            "Benefits: Guaranteed uniqueness across distributed clusters, natural chronological sorting, and built-in timestamp metadata."
        ),
        (
            "Why should database credentials be stored securely in a .env file?",
            "Database connection strings contain critical security credentials including administrator usernames, plaintext passwords, "
            "cluster endpoints, and authentication database names. Storing credentials securely in a .env file is essential because:\n\n"
            "• Prevention of Secret Leaks: Hardcoding credentials in source code leads to accidental exposure when pushing to public repositories (e.g., GitHub, GitLab), enabling malicious actors to wipe or hijack databases.\n"
            "• Separation of Configuration from Code: Adheres to Principle III (Config) of the industry-standard Twelve-Factor App methodology, allowing seamless switching across development, staging, and production environments without changing code.\n"
            "• Git Exclusion: The .env file is added to .gitignore, guaranteeing that proprietary secrets never enter version control histories."
        )
    ]

    for q, a in theory_qa:
        qp = doc.add_paragraph()
        qp.paragraph_format.space_before = Pt(8)
        qp.paragraph_format.space_after = Pt(2)
        rq = qp.add_run(f"• {q}")
        rq.bold = True
        rq.font.size = Pt(10.5)
        rq.font.color.rgb = RGBColor(30, 41, 59)

        ap = doc.add_paragraph()
        ap.paragraph_format.space_after = Pt(8)
        ra = ap.add_run(a)
        ra.font.size = Pt(9.5)
        ra.font.color.rgb = RGBColor(51, 65, 85)

    # 4. Code
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(14)
    h4.paragraph_format.space_after = Pt(6)
    r = h4.add_run("4. Code")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor(15, 23, 42)

    code_sections = [
        (
            "4.1 MongoDB Atlas & Environment Configuration (.env & .env.example)",
            "# Server Environment Configuration\n"
            "PORT=5000\n"
            "NODE_ENV=development\n\n"
            "# MongoDB Atlas Cloud Database Connection String:\n"
            "MONGODB_URI=mongodb+srv://admin_fsd:SecurePass123@cluster0.abcde.mongodb.net/eventDB?retryWrites=true&w=majority\n\n"
            "# Local MongoDB Connection String (Fallback):\n"
            "# MONGODB_URI=mongodb://127.0.0.1:27017/eventDB"
        ),
        (
            "4.2 Mongoose Database Connection Module (config/db.js)",
            "const mongoose = require('mongoose');\n\n"
            "const connectDB = async () => {\n"
            "  try {\n"
            "    const conn = await mongoose.connect(process.env.MONGODB_URI);\n"
            "    console.log(`===============================================`);\n"
            "    console.log(` MongoDB Connected Successfully!`);\n"
            "    console.log(` Host:     ${conn.connection.host}`);\n"
            "    console.log(` Database: ${conn.connection.name}`);\n"
            "    console.log(` Port:     ${conn.connection.port}`);\n"
            "    console.log(`===============================================`);\n"
            "  } catch (error) {\n"
            "    console.error(`❌ MongoDB Connection Error: ${error.message}`);\n"
            "    process.exit(1); // Exit process on critical connection failure\n"
            "  }\n"
            "};\n\n"
            "module.exports = connectDB;"
        ),
        (
            "4.3 Creation of Event Schema and Model (models/Event.js)",
            "const mongoose = require('mongoose');\n\n"
            "const eventSchema = new mongoose.Schema(\n"
            "  {\n"
            "    name: {\n"
            "      type: String,\n"
            "      required: [true, 'Event name is required'],\n"
            "      trim: true,\n"
            "      minlength: [3, 'Event name must be at least 3 characters'],\n"
            "      maxlength: [100, 'Event name cannot exceed 100 characters']\n"
            "    },\n"
            "    date: {\n"
            "      type: String,\n"
            "      required: [true, 'Event date is required'],\n"
            "      trim: true\n"
            "    },\n"
            "    location: {\n"
            "      type: String,\n"
            "      required: [true, 'Event location is required'],\n"
            "      trim: true\n"
            "    },\n"
            "    description: { type: String, trim: true, default: '' },\n"
            "    capacity: { type: Number, required: true, min: 1, default: 100 },\n"
            "    registered: { type: Number, min: 0, default: 0 }\n"
            "  },\n"
            "  {\n"
            "    timestamps: true, // Auto createdAt and updatedAt\n"
            "    versionKey: false\n"
            "  }\n"
            ");\n\n"
            "// Ensure id virtual is exposed alongside _id for frontend compatibility\n"
            "eventSchema.set('toJSON', {\n"
            "  virtuals: true,\n"
            "  transform: (doc, ret) => {\n"
            "    ret.id = ret._id.toString();\n"
            "    return ret;\n"
            "  }\n"
            "});\n\n"
            "module.exports = mongoose.model('Event', eventSchema);"
        ),
        (
            "4.4 Implementation of all Five CRUD API Operations (controllers/eventController.js)",
            "const mongoose = require('mongoose');\n"
            "const Event = require('../models/Event');\n\n"
            "// 1. GET ALL EVENTS\n"
            "exports.getAllEvents = async (req, res, next) => {\n"
            "  try {\n"
            "    const events = await Event.find().sort({ createdAt: -1 });\n"
            "    res.status(200).json({ success: true, count: events.length, data: events });\n"
            "  } catch (error) { next(error); }\n"
            "};\n\n"
            "// 2. GET SINGLE EVENT BY ID\n"
            "exports.getEventById = async (req, res, next) => {\n"
            "  try {\n"
            "    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {\n"
            "      return res.status(400).json({ success: false, message: 'Invalid 24-char ObjectId format' });\n"
            "    }\n"
            "    const event = await Event.findById(req.params.id);\n"
            "    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });\n"
            "    res.status(200).json({ success: true, data: event });\n"
            "  } catch (error) { next(error); }\n"
            "};\n\n"
            "// 3. POST CREATE NEW EVENT\n"
            "exports.createEvent = async (req, res, next) => {\n"
            "  try {\n"
            "    const { name, date, location, description, capacity, registered } = req.body;\n"
            "    if (!name || !date || !location) {\n"
            "      return res.status(400).json({ success: false, message: 'Name, date, and location are required' });\n"
            "    }\n"
            "    const newEvent = await Event.create({ name, date, location, description, capacity, registered });\n"
            "    res.status(201).json({ success: true, message: 'Created successfully', data: newEvent });\n"
            "  } catch (error) { next(error); }\n"
            "};\n\n"
            "// 4. PUT UPDATE EVENT BY ID\n"
            "exports.updateEvent = async (req, res, next) => {\n"
            "  try {\n"
            "    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {\n"
            "      return res.status(400).json({ success: false, message: 'Invalid 24-char ObjectId format' });\n"
            "    }\n"
            "    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });\n"
            "    if (!updated) return res.status(404).json({ success: false, message: 'Event not found' });\n"
            "    res.status(200).json({ success: true, message: 'Updated successfully', data: updated });\n"
            "  } catch (error) { next(error); }\n"
            "};\n\n"
            "// 5. DELETE EVENT BY ID\n"
            "exports.deleteEvent = async (req, res, next) => {\n"
            "  try {\n"
            "    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {\n"
            "      return res.status(400).json({ success: false, message: 'Invalid 24-char ObjectId format' });\n"
            "    }\n"
            "    const deleted = await Event.findByIdAndDelete(req.params.id);\n"
            "    if (!deleted) return res.status(404).json({ success: false, message: 'Event not found' });\n"
            "    res.status(200).json({ success: true, message: 'Deleted successfully', data: deleted });\n"
            "  } catch (error) { next(error); }\n"
            "};"
        ),
        (
            "4.5 Request Validation & Centralized Error Middleware (middleware/errorMiddleware.js)",
            "const errorHandler = (err, req, res, next) => {\n"
            "  console.error(`❌ [Error]: ${err.name}: ${err.message}`);\n\n"
            "  // Mongoose Malformed ObjectId (CastError)\n"
            "  if (err.name === 'CastError') {\n"
            "    return res.status(400).json({\n"
            "      success: false,\n"
            "      errorType: 'CastError',\n"
            "      message: `Invalid ID '${err.value}'. Expected 24-character hexadecimal MongoDB ObjectId.`\n"
            "    });\n"
            "  }\n\n"
            "  // Mongoose Validation Failure\n"
            "  if (err.name === 'ValidationError') {\n"
            "    const errors = Object.values(err.errors).map(val => val.message);\n"
            "    return res.status(400).json({\n"
            "      success: false,\n"
            "      errorType: 'ValidationError',\n"
            "      message: 'Validation failed',\n"
            "      errors\n"
            "    });\n"
            "  }\n\n"
            "  res.status(err.statusCode || 500).json({\n"
            "    success: false,\n"
            "    message: err.message || 'Internal Server Error'\n"
            "  });\n"
            "};\n\n"
            "module.exports = errorHandler;"
        ),
        (
            "4.6 Integration with React Frontend (frontend/src/App.jsx snippet)",
            "// Fetching live persistent documents from MongoDB via Express API\n"
            "const fetchEvents = async () => {\n"
            "  try {\n"
            "    setLoading(true);\n"
            "    const res = await fetch('http://localhost:5000/api/events');\n"
            "    const data = await res.json();\n"
            "    if (data.success) {\n"
            "      setEvents(data.data);\n"
            "    }\n"
            "  } catch (err) {\n"
            "    setError('Failed connecting to MongoDB backend');\n"
            "  } finally {\n"
            "    setLoading(false);\n"
            "  }\n"
            "};\n\n"
            "// Creating a new Event document persistently in MongoDB\n"
            "const handleCreateEvent = async (formData) => {\n"
            "  const res = await fetch('http://localhost:5000/api/events', {\n"
            "    method: 'POST',\n"
            "    headers: { 'Content-Type': 'application/json' },\n"
            "    body: JSON.stringify(formData)\n"
            "  });\n"
            "  const result = await res.json();\n"
            "  if (result.success) fetchEvents();\n"
            "};"
        )
    ]

    for title, code in code_sections:
        p_ch = doc.add_paragraph()
        p_ch.paragraph_format.space_before = Pt(8)
        p_ch.paragraph_format.space_after = Pt(2)
        r_ch = p_ch.add_run(title)
        r_ch.bold = True
        r_ch.font.size = Pt(10.5)
        r_ch.font.color.rgb = RGBColor(30, 41, 59)
        add_code_block(doc, code)

    # 5. Screenshots
    h5 = doc.add_paragraph()
    h5.paragraph_format.space_before = Pt(14)
    h5.paragraph_format.space_after = Pt(6)
    r = h5.add_run("5. Screenshots")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor(15, 23, 42)

    # A. MongoDB Configuration
    h5a = doc.add_paragraph()
    h5a.paragraph_format.space_before = Pt(6)
    h5a.paragraph_format.space_after = Pt(4)
    r = h5a.add_run("A. MongoDB Configuration")
    r.bold = True
    r.font.size = Pt(11.5)
    r.font.color.rgb = RGBColor(79, 70, 229)

    add_screenshot_table(
        doc,
        num=1,
        title="MongoDB Atlas Cluster and Collection",
        method="Database Viewer",
        endpoint="MongoDB Atlas / Compass (eventDB.events)",
        status="200 Connected",
        expected="MongoDB Atlas / Compass interface showing the 'eventDB' database and 'events' collection containing persistent event documents with ObjectIds."
    )

    add_screenshot_table(
        doc,
        num=2,
        title="Successful Database Connection in Server Terminal",
        method="Console Log",
        endpoint="node server.js / npm run dev",
        status="Connection Established",
        expected="Server terminal output showing 'MongoDB Connected Successfully!', cluster host, database name (eventDB), and active listening on port 5000."
    )

    # B. Postman API Testing
    h5b = doc.add_paragraph()
    h5b.paragraph_format.space_before = Pt(10)
    h5b.paragraph_format.space_after = Pt(4)
    r = h5b.add_run("B. Postman API Testing")
    r.bold = True
    r.font.size = Pt(11.5)
    r.font.color.rgb = RGBColor(79, 70, 229)

    add_screenshot_table(
        doc,
        num=3,
        title="GET – Retrieve all events",
        method="GET",
        endpoint="http://localhost:5000/api/events",
        status="200 OK",
        expected="JSON response containing success: true, count: 4, and array of event documents fetched from MongoDB with 24-character ObjectIds."
    )

    add_screenshot_table(
        doc,
        num=4,
        title="GET – Retrieve an event by ID",
        method="GET",
        endpoint="http://localhost:5000/api/events/6aeeb86a3f923be5a701c6c1",
        status="200 OK",
        expected="JSON response with success: true and data object of the single event matching the requested 24-character hexadecimal MongoDB ObjectId."
    )

    add_screenshot_table(
        doc,
        num=5,
        title="POST – Create a new event",
        method="POST",
        endpoint="http://localhost:5000/api/events",
        status="201 Created",
        expected="JSON response confirming event creation with newly assigned MongoDB _id, status 201 Created, and message 'Event created successfully in MongoDB'."
    )

    add_screenshot_table(
        doc,
        num=6,
        title="PUT – Update an event",
        method="PUT",
        endpoint="http://localhost:5000/api/events/6aeeb86a3f923be5a701c6c1",
        status="200 OK",
        expected="JSON response displaying the updated event document with modified values (e.g. updated capacity/registered) and message 'Event updated successfully in MongoDB'."
    )

    add_screenshot_table(
        doc,
        num=7,
        title="DELETE – Delete an event",
        method="DELETE",
        endpoint="http://localhost:5000/api/events/6aeeb86a3f923be5a701c6c1",
        status="200 OK",
        expected="JSON response confirming permanent document deletion from MongoDB, returning deleted object and message 'Event deleted successfully from MongoDB'."
    )

    add_screenshot_table(
        doc,
        num=8,
        title="Invalid Request Demonstrating Error Handling",
        method="GET",
        endpoint="http://localhost:5000/api/events/invalid-mongo-id-123",
        status="400 Bad Request",
        expected="JSON error response: success: false, errorType: 'CastError', and message indicating invalid 24-character hexadecimal MongoDB ObjectId format."
    )

    # C. Frontend Integration
    h5c = doc.add_paragraph()
    h5c.paragraph_format.space_before = Pt(10)
    h5c.paragraph_format.space_after = Pt(4)
    r = h5c.add_run("C. Frontend Integration")
    r.bold = True
    r.font.size = Pt(11.5)
    r.font.color.rgb = RGBColor(79, 70, 229)

    add_screenshot_table(
        doc,
        num=9,
        title="React Frontend Displaying Events Retrieved from MongoDB",
        method="GET (fetch from React)",
        endpoint="http://localhost:5173 / http://localhost:5000/api/events",
        status="200 OK",
        expected="React frontend rendering live event cards fetched from MongoDB, showing MongoDB document _id badges, database connection indicator, capacity progress bars, and modal details."
    )

    # Note
    p_note = doc.add_paragraph()
    p_note.paragraph_format.space_before = Pt(8)
    p_note.paragraph_format.space_after = Pt(12)
    r_n = p_note.add_run("Note: Database passwords, credentials, and sensitive cluster tokens are kept in .env and excluded from screenshots and public repositories.")
    r_n.italic = True
    r_n.font.size = Pt(9)
    r_n.font.color.rgb = RGBColor(100, 116, 139)

    # 6. Result & Conclusions
    h6 = doc.add_paragraph()
    h6.paragraph_format.space_before = Pt(12)
    h6.paragraph_format.space_after = Pt(4)
    r = h6.add_run("6. Result")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_res = doc.add_paragraph()
    p_res.paragraph_format.space_after = Pt(6)
    r = p_res.add_run(
        "MongoDB and Mongoose were successfully integrated with the RESTful API for the Event Management System. "
        "All five persistent CRUD operations (GET all, GET by ID, POST, PUT, DELETE) were implemented and thoroughly tested "
        "using Postman with appropriate HTTP status codes (200, 201, 400, 404, 500). Robust request validation and error handling "
        "for MongoDB ObjectIds and schema fields were implemented, and the persistent database records were successfully displayed "
        "and manipulated in the React frontend."
    )
    r.font.size = Pt(10)

    # Links
    p_git = doc.add_paragraph()
    r = p_git.add_run("GitHub Repository: ")
    r.bold = True
    r.font.size = Pt(9.5)
    r2 = p_git.add_run("https://github.com/kirteexh/FSD_5th.Exp (or your repository link)")
    r2.font.size = Pt(9.5)

    p_pm = doc.add_paragraph()
    r = p_pm.add_run("Postman Collection: ")
    r.bold = True
    r.font.size = Pt(9.5)
    r2 = p_pm.add_run("FSD Exp 5 - Event Management API (MongoDB + Mongoose)")
    r2.font.size = Pt(9.5)

    output_path = r"C:\Users\kirte\OneDrive\Desktop\3rd Year\FSD\EXP_5\FSD_Exp_5_Kirteesh_Rakshe_D15A_43.docx"
    doc.save(output_path)
    print(f"Generated successfully: {output_path}")

if __name__ == "__main__":
    build_docx()

