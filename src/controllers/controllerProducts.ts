import { Request, Response } from "express";
import { prisma } from "../databases";
import { ProductsProps } from "../@types/typeProduct";

export const controllers = {
  async read(req: Request, res: Response) {
    const { id, page } = req.query;
    const limit = 2; // Limite de produtos por página
  
    if (id) {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id as string) },
      });
  
      return product
        ? res.status(200).json(product)
        : res.status(404).json({ message: "Product Not Found" });
    }
  
    const pageParam = parseInt(page as string);
    const pageNumber = isNaN(pageParam) ? 1 : Math.max(1, pageParam);
    const skip = (pageNumber - 1) * limit;
  
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({ // todos os dados dos produtos
        skip,
        take: limit,
      }),
      prisma.product.count(), // total de produtos
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
  
    return res.status(200).json({
      page: pageParam,
      limit,
      totalPages,
      totalProducts: totalCount,
      data: products,
    });
  },

  async create(req: Request, res: Response) {
    const { name, amount, description, image, price, validity }: ProductsProps = req.body

    const requiredFields = ['name', 'amount', 'description', 'image', 'price', 'validity']

    // 
    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field] === "") {
        return res.json({ message: `${field} is required` })
      }
    }

    const createProduct = await prisma.product.create({
      data: {
        name,
        amount: Number(amount),
        description,
        image,
        price: Number(price),
        validity: new Date(validity),
      }
    });

    return res.status(201).json(createProduct)
  },

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { name, amount, description, image, price, validity }: ProductsProps = req.body

    const updateProduct = await prisma.product.update({
      where: { id: parseInt( id as string ) },
      data: {
        name: name as string,
        amount: amount as number,
        description: description as string,
        image: image as string,
        price: price as number,
        validity: new Date(validity),
      }
    })

    return res.status(200).json(updateProduct)
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params
    console.log(id);
    
    if (id) {
      await prisma.product.delete({
        where: { id: parseInt( id as string ) }
      })

      return res.status(204).json(`Produto ${id} deletado com sucesso`)
    }

    return res.status(404).json({ message: 'Product Not Found!' })
  }
}