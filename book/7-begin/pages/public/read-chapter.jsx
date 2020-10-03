/* eslint-disable react/sort-comp */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { getChapterDetailApiMethod } from '../../lib/api/public';
import withAuth from '../../lib/withAuth';

const styleIcon = {
  opacity: '0.75',
  fontSize: '24px',
  cursor: 'pointer',
};

const propTypes = {
  chapter: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    htmlContent: PropTypes.string,
  }),
};

const defaultProps = {
  chapter: null,
};

class ReadChapter extends React.Component {
  constructor(props, ...args) {
    super(props, ...args);

    const { chapter } = props;

    let htmlContent = '';
    if (chapter) {
      htmlContent = chapter.htmlContent;
    }

    this.state = {
      showTOC: false,
      chapter,
      htmlContent,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chapter && prevProps.chapter._id !== this.props.chapter._id) {
      document.getElementById('chapter-content').scrollIntoView();

      const { htmlContent } = prevProps.chapter;

      // eslint-disable-next-line
      this.setState({ chapter: prevProps.chapter, htmlContent });
    }
  }

  static async getInitialProps({ req, query }) {
    const { bookSlug, chapterSlug } = query;

    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const chapter = await getChapterDetailApiMethod({ bookSlug, chapterSlug }, { headers });

    return { chapter };
  }

  toggleChapterList = () => {
    this.setState((prevState) => ({ showTOC: !prevState.showTOC }));
  };

  renderMainContent() {
    const { chapter, htmlContent } = this.state;

    return (
      <div>
        <h2>
          Chapter:
          {chapter.title}
        </h2>

        <div
          className="main-content"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  }

  renderSections() {
    const { sections } = this.state.chapter;

    if (!sections || !sections.length === 0) {
      return null;
    }

    return (
      <ul>
        {sections.map((s) => (
          <li key={s.escapedText} style={{ paddingTop: '10px' }}>
            <a href={`#${s.escapedText}`}>{s.text}</a>
          </li>
        ))}
      </ul>
    );
  }

  renderSidebar() {
    const { showTOC, chapter } = this.state;

    if (!showTOC) {
      return null;
    }

    const { book } = chapter;
    const { chapters } = book;

    return (
      <div
        style={{
          textAlign: 'left',
          position: 'absolute',
          bottom: 0,
          top: '64px',
          left: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '400px',
          padding: '0px 25px',
        }}
      >
        <p style={{ padding: '0px 40px', fontSize: '17px', fontWeight: '400' }}>{book.name}</p>
        <ol start="0" style={{ padding: '0 25', fontSize: '14px', fontWeight: '300' }}>
          {chapters.map((ch, i) => (
            <li
              key={ch._id}
              role="presentation"
              style={{ listStyle: i === 0 ? 'none' : 'decimal', paddingBottom: '10px' }}
            >
              <Link
                as={`/books/${book.slug}/${ch.slug}`}
                href={`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=${ch.slug}`}
              >
                <a style={{ color: chapter._id === ch._id ? '#1565C0' : '#222' }}>{ch.title}</a>
              </Link>
              {chapter._id === ch._id ? this.renderSections() : null}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  render() {
    const { chapter } = this.state;

    if (!chapter) {
      return <Error statusCode={404} />;
    }

    return (
      <div>
        <Head>
          <title>
            {chapter.title === 'Introduction'
              ? 'Introduction'
              : `Chapter ${chapter.order - 1}. ${chapter.title}`}
          </title>
          {chapter.seoDescription ? (
            <meta name="description" content={chapter.seoDescription} />
          ) : null}
        </Head>

        {this.renderSidebar()}

        <div
          style={{
            textAlign: 'left',
            padding: '0px 10px 20px 30px',
            position: 'fixed',
            right: 0,
            bottom: 0,
            top: '64px',
            left: '320px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div
            style={{
              position: 'fixed',
              top: '80px',
              left: '15px',
            }}
          />
          {this.renderMainContent()}
        </div>
        <div
          style={{
            position: 'fixed',
            // top: hideHeader ? '20px' : '80px',
            transition: 'top 0.5s ease-in',
            left: '15px',
          }}
        >
          <i // eslint-disable-line
            className="material-icons"
            style={styleIcon}
            onClick={this.toggleChapterList}
            onKeyPress={this.toggleChapterList}
            role="button"
          >
            format_list_bulleted
          </i>
        </div>
      </div>
    );
  }
}

ReadChapter.propTypes = propTypes;
ReadChapter.defaultProps = defaultProps;

export default withAuth(ReadChapter, { loginRequired: false });
