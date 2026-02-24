import pandas as pd

def show_feature_importance(model, feature_names):
    coefficients = model.coef_[0]

    feature_importance = pd.DataFrame({
        "Feature": feature_names,
        "Coefficient": coefficients
    })

    top_spam = feature_importance.sort_values(
        by="Coefficient", ascending=False
    ).head(15)

    top_ham = feature_importance.sort_values(
        by="Coefficient"
    ).head(15)

    print("Top Spam Indicators:")
    print(top_spam)

    print("\nTop Ham Indicators:")
    print(top_ham)



    