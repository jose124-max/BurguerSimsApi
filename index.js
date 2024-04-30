import express from 'express';
import fs, { read } from "fs";

const app = express();

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }

};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }

};

readData();

app.get("/", (req, res) => {
    res.send("Bienvenidos a la API de BurguerSim");
})
app.get("/company/get-info", (req, res) => {
    const data = readData();
    res.send(data.company);
})

app.get("/company/get-branchs/:limit/:page", (req, res) => {
    try {
        const limit = parseInt(req.params.limit, 10);
        const page = parseInt(req.params.page, 10);
        if (isNaN(limit) || isNaN(page) || limit < 1 || page < 1) {
            return res.status(400).send("Invalid parameters. Both limit and page should be positive integers.");
        }
        const data = readData();
        if (!data.branchs) {
            return res.status(404).send("Branch data not found.");
        }
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = data.branchs.slice(startIndex, endIndex);
        res.json({
            page: page,
            limit: limit,
            totalItems: data.branchs.length,
            totalPages: Math.ceil(data.branchs.length / limit),
            data: paginatedItems
        });
    } catch (error) {
        console.log(error);
    }
})

app.get("/company/get-branchs/:id", (req, res) => {
    const branchId = parseInt(req.params.id);
    const branch = readData().branchs.find(branch => branch.id === branchId);
    if (branch) {
        res.json(branch);
    } else {
        res.status(404).json({ error: "Branch not found" });
    }
});
app.get("/company/geoSector/:id", (req, res) => {
    const geosectorId = parseInt(req.params.id);
    const geosector = readData().geoSector.find(geosector => geosector.id === geosectorId);
    if (geosector) {
        res.json(geosector);
    } else {
        res.status(404).json({ error: "Branch not found" });
    }
});
app.get("/company/weeklyShedules/:id", (req, res) => {
    const weeklyid = parseInt(req.params.id);
    const weekly = readData().weeklySchedules.find(weekly => weekly.id === weeklyid);
    if (weekly) {
        res.json(weekly);
    } else {
        res.status(404).json({ error: "weekly shedules not found" });
    }
});

app.get("/company/get-types-products/:limit/:page", (req, res) => {
    try {
        const limit = parseInt(req.params.limit, 10);
        const page = parseInt(req.params.page, 10);
        if (isNaN(limit) || isNaN(page) || limit < 1 || page < 1) {
            return res.status(400).send("Invalid parameters. Both limit and page should be positive integers.");
        }
        const data = readData();
        if (!data.typesProducts) {
            return res.status(404).send("Types data not found.");
        }
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = data.typesProducts.slice(startIndex, endIndex);
        res.json({
            page: page,
            limit: limit,
            totalItems: data.typesProducts.length,
            data: paginatedItems
        });
    } catch (error) {
        console.log(error);
    }
})

app.get("/company/get-types-products/:id", (req, res) => {
    const typesProductsid = parseInt(req.params.id);
    const typesProducts = readData().typesProducts.find(typesProduct => typesProduct.id === typesProductsid);
    if (typesProducts) {
        res.json(typesProducts);
    } else {
        res.status(404).json({ error: "types products not found" });
    }
});

app.get("/company/get-category/:limit/:page", (req, res) => {
    try {
        const limit = parseInt(req.params.limit, 10);
        const page = parseInt(req.params.page, 10);
        if (isNaN(limit) || isNaN(page) || limit < 1 || page < 1) {
            return res.status(400).send("Invalid parameters. Both limit and page should be positive integers.");
        }
        const data = readData();
        if (!data.category) {
            return res.status(404).send("category not found.");
        }
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = data.category.slice(startIndex, endIndex);
        res.json({
            page: page,
            limit: limit,
            totalItems: data.category.length,
            data: paginatedItems
        });
    } catch (error) {
        console.log(error);
    }
})

app.get("/company/get-category/:id", (req, res) => {
    const typesProductsid = parseInt(req.params.id);
    const categories = readData().category.find(category => category.id_typesproducts === typesProductsid);
    if (categories) {
        res.json(categories);
    } else {
        res.status(404).json({ error: "Categories not found" });
    }
});
app.get("/company/get-category-by-type/:id/:limit/:page", (req, res) => {
    try {
        const typesProductsid = parseInt(req.params.id);
        const limit = parseInt(req.params.limit, 10);
        const page = parseInt(req.params.page, 10);
        if (isNaN(limit) || isNaN(page) || limit < 1 || page < 1) {
            return res.status(400).send("Invalid parameters. Both limit and page should be positive integers.");
        }
        const data = readData();
        if (!data.category) {
            return res.status(404).send("category not found.");
        }
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const categories = data.category.filter(category => category.id_typesproducts === typesProductsid);
        const paginatedItems = categories.slice(startIndex, endIndex);
        
        if (paginatedItems.length> 0) {
            res.json({
                page: page,
                limit: limit,
                totalItems: categories.length,
                data: paginatedItems
            });
        } else {
            res.status(404).json({ error: "Categories not found" });
        }
        
    } catch (error) {
        console.log(error);
    }
});

app.get("/company/get-products/:limit/:page", (req, res) => {
    try {
        const limit = parseInt(req.params.limit, 10);
        const page = parseInt(req.params.page, 10);
        if (isNaN(limit) || isNaN(page) || limit < 1 || page < 1) {
            return res.status(400).send("Invalid parameters. Both limit and page should be positive integers.");
        }
        const data = readData();
        if (!data.products) {
            return res.status(404).send("Products data not found.");
        }
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = data.products.slice(startIndex, endIndex);
        res.json({
            page: page,
            limit: limit,
            totalItems: data.products.length,
            data: paginatedItems
        });
    } catch (error) {
        console.log(error);
    }
})

app.get("/company/get-products-by-category/:id/:limit/:page", (req, res) => {
    try {
        const categoryid = parseInt(req.params.id);
        const limit = parseInt(req.params.limit, 10);
        const page = parseInt(req.params.page, 10);
        if (isNaN(limit) || isNaN(page) || limit < 1 || page < 1) {
            return res.status(400).send("Invalid parameters. Both limit and page should be positive integers.");
        }
        const data = readData();
        if (!data.products) {
            return res.status(404).send("Products not found.");
        }
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const products = data.products.filter(products => products.id_category === categoryid);
        const paginatedItems = products.slice(startIndex, endIndex);
        
        if (paginatedItems.length> 0) {
            res.json({
                page: page,
                limit: limit,
                totalItems: products.length,
                data: paginatedItems
            });
        } else {
            res.status(404).json({ error: "Products not found" });
        }
        
    } catch (error) {
        console.log(error);
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})