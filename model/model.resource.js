/**
 * Contains model for resources
 */

function constructResourceFromBody(body) {
    return {
        title: body.title,
        subject: body.subject,
        description: body.description,
        likes: body.likes,
        date_created: body.date_created,
        last_modified: body.last_modified,
        lesson_numbers: body.lesson_numbers,
        links: body.links,
        search_tags: body.search_tags,
        contributing_students: body.contributing_students,
        featured_technologies: body.featured_technologies
    }
}

module.exports = { constructResourceFromBody };

// import { Request, Response } from 'express';
// const { ObjectId } = require('mongodb');

// class ResourceManager {
//     createResource(req: Request, params: Object | null = null) {
//         const body = req.body
//         return new Resource(
//             body.title,
//             body.subject,
//             body.related_lessons,
//             body.helpful_links,
//             body.search_tags,
//             body.description,
//             body.code_examples,
//             body.authors,
//             body.citations,
//             body.used_languages,
//             body.likes,
//             body.date_created,
//             body.last_updated,
//             body.views,
//             body.instructor_notes
//         )
//     }
// }

// class Resource {
//     constructor(
//         private title: string,
//         private subject: string,
//         private related_lessons: number[],
//         private helpful_links: HelpfulLinks[],
//         private search_tags: string[],
//         private description: string,
//         private code_examples: CodeExample[],
//         private authors: string[],
//         private citations: string[],
//         private used_languages: programmingLanguages[],
//         private likes: number,
//         private date_created: Date,
//         private last_updated: Date,
//         private views: number,
//         private instructor_notes: string,
//     ) { }
// }

// export class HelpfulLinks {
//     constructor(
//         public title: string,
//         public category: linkCategory,
//         public url: string,
//     ) { }
// }

// enum linkCategory {
//     forumPost = "FORUM POST",
//     website = "WEBSITE",
//     video = "VIDEO"
// }

// export class CodeExample {
//     constructor(
//         public title: string,
//         public code: string,
//         public side_notes: string,
//     ) { }
// }

// enum programmingLanguages {
//     javaScript = "JAVASCRIPT",
//     html = "HTML",
//     css = "CSS",
//     typeScript = "TYPESCRIPT",
//     json = "JSON",
//     other = "OTHER",
// }

