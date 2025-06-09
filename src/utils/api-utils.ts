import { Request, Response, NextFunction } from 'express'

interface ParsedQuery {
  size: number | undefined;
  page: number | undefined;
  sort: string[] | undefined;
}

export type ParsedRequest = Request & { parsedQuery: ParsedQuery }

export function parseQueryParam(req: Request, res: Response, next: NextFunction) {
    const { page, size, sort } = req.query
    const parsedPage = page != undefined ? parseInt(page as string, 10) : undefined
    const parsedSize = size != undefined ? parseInt(size as string, 10) : undefined
    const parsedSort = sort != undefined ? (sort as string).split(',') : undefined

    if(parsedSort != undefined && (parsedSort.length != 2)) {
        res.status(400).json({error: 'Sort query param is invalid'})
        return
    }

    if(parsedPage != undefined && (isNaN(parsedPage) || parsedPage < 0)){
        res.status(400).json({error: 'Page query param is invalid'})
        return
    }
    if(parsedSize != undefined && (isNaN(parsedSize) || parsedSize < 0)){
        res.status(400).json({error: 'Size query param is invalid'})
        return
    }

    (req as ParsedRequest).parsedQuery = {
        page: parsedPage,
        size: parsedSize,
        sort: parsedSort
    }
    next()
}