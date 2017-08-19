export default () => {
  return (
    <div className="footer">
      <div>
        <small>made with vx</small>
      </div>
      <div>
        <a href="https://vx-demo.now.sh/gallery">
          <small>vx-demo.now.sh/gallery</small>
        </a>
      </div>
      <div>
        <a href="https://github.com/hshoff/viewsource">
          <small>github.com/hshoff/viewsource</small>
        </a>
      </div>
      <style jsx>{`
        .footer {
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
};
