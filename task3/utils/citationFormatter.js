/**
 * Format citations for reference articles
 */
export class CitationFormatter {
  /**
   * Format citations as HTML
   */
  formatCitations(referenceArticles) {
    if (!referenceArticles || referenceArticles.length === 0) {
      return '';
    }

    let citationsHtml = '\n\n<div class="article-citations">\n<h3>References</h3>\n<ol class="citation-list">\n';
    
    referenceArticles.forEach((article, index) => {
      const author = article.author || 'Unknown Author';
      const title = article.title || 'Untitled';
      const url = article.sourceUrl || article.url || '';
      const date = article.publishedDate 
        ? new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';

      citationsHtml += `<li class="citation-item">\n`;
      citationsHtml += `<strong>${title}</strong><br>\n`;
      if (author !== 'Unknown Author') {
        citationsHtml += `By ${author}`;
        if (date) citationsHtml += `, ${date}`;
        citationsHtml += '<br>\n';
      }
      if (url) {
        citationsHtml += `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>\n`;
      }
      citationsHtml += `</li>\n`;
    });

    citationsHtml += '</ol>\n</div>';

    return citationsHtml;
  }

  /**
   * Format citations as plain text
   */
  formatCitationsText(referenceArticles) {
    if (!referenceArticles || referenceArticles.length === 0) {
      return '';
    }

    let citations = '\n\nReferences:\n';
    
    referenceArticles.forEach((article, index) => {
      const author = article.author || 'Unknown Author';
      const title = article.title || 'Untitled';
      const url = article.sourceUrl || article.url || '';
      const date = article.publishedDate 
        ? new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';

      citations += `${index + 1}. ${title}\n`;
      if (author !== 'Unknown Author') {
        citations += `   By ${author}`;
        if (date) citations += `, ${date}`;
        citations += '\n';
      }
      if (url) {
        citations += `   ${url}\n`;
      }
      citations += '\n';
    });

    return citations;
  }
}

